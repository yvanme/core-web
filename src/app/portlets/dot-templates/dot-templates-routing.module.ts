import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DotTemplateListComponent } from '@portlets/dot-templates/dot-template-list/dot-template-list.component';
import { DotTemplateListResolver } from '@portlets/dot-templates/dot-template-list/dot-template-list-resolver.service';
import { DotTemplateComponent } from '@portlets/dot-templates/dot-template/dot-template.component';

const routes: Routes = [
    {
        path: '',
        component: DotTemplateListComponent,
        resolve: {
            dotTemplateListResolverData: DotTemplateListResolver
        }
    },
    {
        path: 'new',
        component: DotTemplateComponent,
        children: [
            {
                path: 'advanced',
                component: DotTemplateComponent,
                loadChildren: () =>
                    import('@portlets/dot-templates//dot-template/dot-template.module').then(
                        (m) => m.DotTemplateModule
                    )
            }
        ]
    }
];

@NgModule({ imports: [RouterModule.forChild(routes)] })
export class DotTemplatesRoutingModule {}