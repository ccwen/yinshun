const {setExcludeByStr}=require("./filter");
const {_showExcerpt}=require("./excerpt");
const {parseRoute}=require("../unit/hashtag");
const {EXCERPTVIEW}=require("./params");
const {_search}=require("./search");
const {SET_PARAMS}=require("../actions/params");

function dosearch(corpus,q,dispatch,getState,cb){
	if (getState().params.q!==q) {
		_search(corpus,q,dispatch,getState,cb);
	} else {
		cb&&cb();
	}
}

const execURL=function() {
	return (dispatch,getState) =>{

		const params=parseRoute(window.location.hash);
		const p=getState().params;

		dosearch(getState().activeCorpus,params.q||"",dispatch,getState,function(){
			dispatch(Object.assign({type:SET_PARAMS},params));
			if (params.ex && params.ex!==p.ex) {
				setExcludeByStr(params.ex,dispatch,getState);
			}
			if (parseInt(params.m)==EXCERPTVIEW) {
				_showExcerpt(parseInt(params.n)||0,dispatch,getState);
			}
		});
	}
}
module.exports={execURL};