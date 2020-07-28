import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    DotPushPublishFilter,
    DotPushPublishFiltersService
} from '@services/dot-push-publish-filters/dot-push-publish-filters.service';
import { catchError, filter, map, take, takeUntil } from 'rxjs/operators';
import { DotPushPublishDialogData } from 'dotcms-models';
import { Observable, of, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotParseHtmlService } from '@services/dot-parse-html/dot-parse-html.service';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DotPushPublishData } from '@models/dot-push-publish-data/dot-push-publish-data';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'dot-push-publish-form',
    templateUrl: './dot-push-publish-form.component.html',
    styleUrls: ['./dot-push-publish-form.component.scss']
})
export class DotPushPublishFormComponent implements OnInit, OnDestroy {
    dateFieldMinDate = new Date();
    dialogActions: DotDialogActions;
    dialogShow = false;
    form: FormGroup;
    pushActions: SelectItem[];
    filterOptions: SelectItem[] = null;
    eventData: DotPushPublishDialogData = { assetIdentifier: '', title: '' };
    assetIdentifier: string;

    @Input() data: DotPushPublishDialogData;

    @Output() value = new EventEmitter<DotPushPublishData>();
    @Output() valid = new EventEmitter<boolean>();

    @ViewChild('customCode') customCodeContainer: ElementRef;

    private defaultFilterKey: string;
    private _filterOptions: SelectItem[] = null;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotPushPublishFiltersService: DotPushPublishFiltersService,
        private dotParseHtmlService: DotParseHtmlService,
        private dotMessageService: DotMessageService,
        public fb: FormBuilder
    ) {}

    ngOnInit() {
        if (this.data) {
            if (this.filterOptions) {
                this.loadData(this.data);
            } else {
                this.loadFilters()
                    .pipe(take(1))
                    .subscribe(() => {
                        this.loadData(this.data);
                    });
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private loadData(data: DotPushPublishDialogData): void {
        this.eventData = data;
        if (this.eventData.customCode) {
            this.loadCustomCode();
        } else {
            this.assetIdentifier = this.eventData.assetIdentifier;
            this.pushActions = this.getPushPublishActions();
            this.initForm({
                filterKey: this.defaultFilterKey
            });
            this.form.valueChanges.subscribe(() => {
                this.emitValues();
            });
            this.emitValues();
        }
        this.dialogShow = true;
    }

    private loadCustomCode(): void {
        this.dotParseHtmlService.parse(
            this.eventData.customCode,
            this.customCodeContainer.nativeElement,
            true
        );
    }

    private loadFilters(): Observable<any> {
        return this.dotPushPublishFiltersService.get().pipe(
            map((filterOptions: DotPushPublishFilter[]) => {
                this._filterOptions = filterOptions
                    .map((item: DotPushPublishFilter) => {
                        return {
                            label: item.title,
                            value: item.key
                        };
                    })
                    .sort((a: SelectItem, b: SelectItem) => {
                        if (a.label > b.label) {
                            return 1;
                        }
                        if (a.label < b.label) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });

                this.filterOptions = this._filterOptions;

                this.defaultFilterKey = filterOptions
                    .filter(({ defaultFilter }: DotPushPublishFilter) => defaultFilter)
                    .map(({ key }: DotPushPublishFilter) => key)
                    .join();
            }),
            catchError(() => of([]))
        );
    }

    private initForm(params?: { [key: string]: any }): void {
        this.form = this.fb.group({
            ...params,
            pushActionSelected: [this.pushActions[0].value, [Validators.required]],
            publishdate: [new Date(), [Validators.required]],
            expiredate: [{ value: new Date(), disabled: true }, [Validators.required]],
            environment: ['', [Validators.required]],
            forcePush: false
        });

        const publishDate = this.form.get('publishdate');
        const expireDate = this.form.get('expiredate');
        const ppFilter = this.form.get('filterKey');

        const enableFilters = () => {
            ppFilter.enable();
            this.filterOptions = this._filterOptions;
            ppFilter.setValue(this.defaultFilterKey);
        };

        this.form
            .get('filterKey')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .pipe(filter((value: string) => !!value))
            .subscribe((filterSelected: string) => {
                this.defaultFilterKey = filterSelected;
            });

        this.form
            .get('pushActionSelected')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((pushActionSelected: string) => {
                switch (pushActionSelected) {
                    case 'publish': {
                        publishDate.enable();
                        expireDate.disable();
                        enableFilters();
                        break;
                    }
                    case 'expire': {
                        publishDate.disable();
                        expireDate.enable();
                        ppFilter.disable();
                        ppFilter.setValue('');
                        this.filterOptions = [];
                        break;
                    }
                    default: {
                        publishDate.enable();
                        expireDate.enable();
                        enableFilters();
                    }
                }
            });
    }

    private getPushPublishActions(): SelectItem[] {
        return [
            {
                label: this.dotMessageService.get('contenttypes.content.push_publish.action.push'),
                value: 'publish'
            },
            {
                label: this.dotMessageService.get(
                    'contenttypes.content.push_publish.action.remove'
                ),
                value: 'expire',
                disabled: this.isRestrictedOrCategory()
            },
            {
                label: this.dotMessageService.get(
                    'contenttypes.content.push_publish.action.pushremove'
                ),
                value: 'publishexpire',
                disabled: this.eventData.removeOnly || this.isRestrictedOrCategory()
            }
        ];
    }

    private isRestrictedOrCategory(): boolean {
        return this.eventData.restricted || this.eventData.cats;
    }

    private emitValues(): void {
        this.value.emit(this.form.value);
        this.valid.emit(this.form.status === 'VALID');
    }
}