var __awaiter=this&&this.__awaiter||function(t,e,o,n){return new(o||(o=Promise))(function(r,a){function s(t){try{u(n.next(t))}catch(t){a(t)}}function i(t){try{u(n.throw(t))}catch(t){a(t)}}function u(t){t.done?r(t.value):new o(function(e){e(t.value)}).then(s,i)}u((n=n.apply(t,e||[])).next())})},__generator=this&&this.__generator||function(t,e){var o,n,r,a,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(o)throw new TypeError("Generator is already executing.");for(;s;)try{if(o=1,n&&(r=2&a[0]?n.return:a[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,a[1])).done)return r;switch(n=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return s.label++,{value:a[1],done:!1};case 5:s.label++,n=a[1],a=[0];continue;case 7:a=s.ops.pop(),s.trys.pop();continue;default:if(!(r=(r=s.trys).length>0&&r[r.length-1])&&(6===a[0]||2===a[0])){s=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){s.label=a[1];break}if(6===a[0]&&s.label<r[1]){s.label=r[1],r=a;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(a);break}r[2]&&s.ops.pop(),s.trys.pop();continue}a=e.call(t,s)}catch(t){a=[6,t],n=0}finally{o=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}};dotcmsFields.loadBundle("xkwixfg2",["exports","./chunk-35cb6fec.js","./chunk-42b2163a.js","./chunk-01704cfd.js"],function(exports,__chunk_1,__chunk_2,__chunk_3){var h=window.dotcmsFields.h,DotUploadService=function(){function t(){}return t.prototype.uploadFile=function(t,e){return"string"==typeof t?this.uploadFileByURL(t):this.uploadBinaryFile(t,e)},t.prototype.uploadFileByURL=function(t){var e=this;return fetch("/api/v1/temp/byUrl",{method:"POST",headers:{"Content-Type":"application/json",Origin:window.location.hostname},body:JSON.stringify({remoteUrl:t})}).then(function(t){return __awaiter(e,void 0,void 0,function(){var e;return __generator(this,function(o){switch(o.label){case 0:return 200!==t.status?[3,2]:[4,t.json()];case 1:return[2,o.sent().tempFiles[0]];case 2:return e={},[4,t.json()];case 3:throw e.message=o.sent().message,e.status=t.status,e}})})})},t.prototype.uploadBinaryFile=function(t,e){var o=this,n="/api/v1/temp";n+=e?"?maxFileLength="+e:"";var r=new FormData;return r.append("file",t),fetch(n,{method:"POST",headers:{Origin:window.location.hostname},body:r}).then(function(t){return __awaiter(o,void 0,void 0,function(){var e;return __generator(this,function(o){switch(o.label){case 0:return 200!==t.status?[3,2]:[4,t.json()];case 1:return[2,o.sent().tempFiles[0]];case 2:return e={},[4,t.json()];case 3:throw e.message=o.sent().message,e.status=t.status,e}})})})},t}(),SUBMIT_FORM_API_URL="/api/v1/workflow/actions/default/fire/NEW",fallbackErrorMessages={500:"500 Internal Server Error",400:"400 Bad Request",401:"401 Unauthorized Error"},DotFormComponent=function(){function DotFormComponent(){this.resetLabel="Reset",this.submitLabel="Submit",this.layout=[],this.variable="",this.status=__chunk_2.getOriginalStatus(),this.errorMessage="",this.uploadFileInProgress=!1,this.fieldsStatus={},this.value={}}return DotFormComponent.prototype.onValueChange=function(t){var e=this,o=t.target.tagName,n=t.detail,r=n.name,a=n.value,s=__chunk_3.fieldCustomProcess[o];"DOT-BINARY-FILE"===o&&a?this.uploadFile(t).then(function(t){e.value[r]=t&&t.id}):this.value[r]=s?s(a):a},DotFormComponent.prototype.onStatusChange=function(t){var e=t.detail;this.fieldsStatus[e.name]=e.status,this.status=__chunk_2.updateStatus(this.status,{dotTouched:this.getTouched(),dotPristine:this.getStatusValueByName("dotPristine"),dotValid:this.getStatusValueByName("dotValid")})},DotFormComponent.prototype.layoutWatch=function(){this.value=this.getUpdateValue()},DotFormComponent.prototype.fieldsToShowWatch=function(){this.value=this.getUpdateValue()},DotFormComponent.prototype.hostData=function(){return{class:__chunk_2.getClassNames(this.status,this.status.dotValid)}},DotFormComponent.prototype.componentWillLoad=function(){this.value=this.getUpdateValue()},DotFormComponent.prototype.render=function(){var t=this;return h(__chunk_1.Fragment,null,h("form",{onSubmit:this.handleSubmit.bind(this)},this.layout.map(function(e){return h("dot-form-row",{row:e,"fields-to-show":t.fieldsToShow})}),h("div",{class:"dot-form__buttons"},h("button",{type:"reset",onClick:function(){return t.resetForm()}},this.resetLabel),h("button",{type:"submit",disabled:!this.status.dotValid||this.uploadFileInProgress},this.submitLabel))),h("dot-error-message",null,this.errorMessage))},DotFormComponent.prototype.getStatusValueByName=function(t){return Object.values(this.fieldsStatus).map(function(e){return e[t]}).every(function(t){return!0===t})},DotFormComponent.prototype.getTouched=function(){return Object.values(this.fieldsStatus).map(function(t){return t.dotTouched}).includes(!0)},DotFormComponent.prototype.handleSubmit=function(t){var e=this;t.preventDefault(),fetch(SUBMIT_FORM_API_URL,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({contentlet:Object.assign({contentType:this.variable},this.value)})}).then(function(t){return __awaiter(e,void 0,void 0,function(){var e;return __generator(this,function(o){switch(o.label){case 0:return 200===t.status?[3,2]:(e={},[4,t.text()]);case 1:throw e.message=o.sent(),e.status=t.status,e;case 2:return[2,t.json()]}})})}).then(function(t){e.runSuccessCallback(t.entity)}).catch(function(t){var o=t.status;e.errorMessage=__chunk_3.getErrorMessage(t.message)||fallbackErrorMessages[o]})},DotFormComponent.prototype.runSuccessCallback=function(contentlet){var successCallback=this.getSuccessCallback();if(successCallback)return function(){return eval(successCallback)}.call({contentlet:contentlet})},DotFormComponent.prototype.getSuccessCallback=function(){return __chunk_3.getFieldsFromLayout(this.layout).filter(function(t){return"formSuccessCallback"===t.variable})[0].values},DotFormComponent.prototype.resetForm=function(){Array.from(this.el.querySelectorAll("form dot-form-column > *")).forEach(function(t){try{t.reset()}catch(e){console.warn(""+t.tagName,e)}})},DotFormComponent.prototype.getUpdateValue=function(){return __chunk_3.getFieldsFromLayout(this.layout).filter(function(t){return!1===t.fixed}).reduce(function(t,e){var o;return Object.assign({},t,((o={})[e.variable]=e.defaultValue||("TEXT"!==e.dataType?e.values:null),o))},{})},DotFormComponent.prototype.getMaxSize=function(t){var e=t.target.attributes.slice().filter(function(t){return"max-file-length"===t.name})[0];return e&&e.value},DotFormComponent.prototype.uploadFile=function(t){var e=this,o=new DotUploadService,n=t.detail.value,r=this.getMaxSize(t),a=t.target;return!r||n.size<=r?(this.uploadFileInProgress=!0,a.errorMessage="",o.uploadFile(n,r).then(function(t){return e.errorMessage="",a.previewImageUrl=t.thumbnailUrl,a.previewImageName=t.fileName,e.uploadFileInProgress=!1,t}).catch(function(t){var o=t.message,n=t.status;return a.clearValue(),e.uploadFileInProgress=!1,e.errorMessage=__chunk_3.getErrorMessage(o)||fallbackErrorMessages[n],null})):(a.reset(),a.errorMessage="File size larger than allowed "+r+" bytes",Promise.resolve(null))},Object.defineProperty(DotFormComponent,"is",{get:function(){return"dot-form"},enumerable:!0,configurable:!0}),Object.defineProperty(DotFormComponent,"properties",{get:function(){return{el:{elementRef:!0},errorMessage:{state:!0},fieldsToShow:{type:String,attr:"fields-to-show",watchCallbacks:["fieldsToShowWatch"]},layout:{type:"Any",attr:"layout",reflectToAttr:!0,watchCallbacks:["layoutWatch"]},resetLabel:{type:String,attr:"reset-label",reflectToAttr:!0},status:{state:!0},submitLabel:{type:String,attr:"submit-label",reflectToAttr:!0},uploadFileInProgress:{state:!0},variable:{type:String,attr:"variable",reflectToAttr:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(DotFormComponent,"listeners",{get:function(){return[{name:"valueChange",method:"onValueChange"},{name:"statusChange",method:"onStatusChange"}]},enumerable:!0,configurable:!0}),Object.defineProperty(DotFormComponent,"style",{get:function(){return"dot-form{display:block}dot-form>form label{margin:0;padding:0}dot-form>form dot-form-column>*{display:block;margin:2rem 0}dot-form>form dot-form-column>:first-child{margin-top:0}dot-form>form dot-form-column>:last-child{margin-bottom:0}dot-form>form .dot-form__buttons{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:end;justify-content:flex-end}dot-form>form .dot-form__buttons button:last-child{margin-left:1rem}"},enumerable:!0,configurable:!0}),DotFormComponent}();exports.DotForm=DotFormComponent,Object.defineProperty(exports,"__esModule",{value:!0})});