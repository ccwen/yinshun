const SET_MARKUPS="SET_MARKUPS";
const WRONG_CORPUS="WRONG_CORPUS";
const {loadMarkup}=require("../unit/markup");
const loadExternalMarkup=function(meta,json,corpus){
	return (dispatch,getState)=>{
		corpus=corpus||getState().activeCorpus;
		const cor=getState().corpora[corpus];
		if (!cor)return {type:WRONG_CORPUS,corpus};
		const markups=loadMarkup(cor,json);
		dispatch({type:SET_MARKUPS, name:meta.type, corpus, markups});
	}
}
module.exports={loadExternalMarkup,SET_MARKUPS};