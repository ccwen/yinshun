/* when a corpus is opened, connect it with already opened */
const taskqueue=[];
const {SET_MARKUPS}=require("../actions/markup");

const connect=function(cor1,cor2, output, links){
	if (cor1===cor2)return;
	var lastfield=null;
	if (cor2.meta.linkTo) {
		for (var field in cor2.meta.linkTo) {
			if (field.indexOf("@"+cor1.id)==-1) continue;
			const articles=cor2.meta.linkTo[field];
			const keys=articles.map(a=>["afields",a,field]);
			lastfield=field;

			links.push([cor2.id,field]);
			taskqueue.push((function(cor,keys){
				return (
					function(data){
						if (!(typeof data=='object' && data.__empty)) {
							output.push(data);
						}
						cor.get(keys,{recursive:true},taskqueue.shift());
					}
				);
			})(cor2,keys)
			);
		}
	}
	return lastfield;
}
const groupByArticle=function(pos,value,cor){
	//group by article
	const markups={};
	for (var i=0;i<pos.length;i++) {
		const kpos=cor.parseRange(pos[i]).start;
		const a=cor.articleOf(kpos).at;
		if (!markups[a]) markups[a]={pos:[],value:[]};
		markups[a].pos.push(pos[i]);
		markups[a].value.push(value[i]);
	}
	return markups;
}
const buildReverseLinks=function(links,corpora){
	const out=[];
	for (var i=0;i<links.length;i++) {
		const corpus=links[i][1].replace(/.*@/,"");
		const fieldname=links[i][1].replace(/@.*/,"")+"@"+links[i][0];
		const pv=[];
		const payload=links[i][2];

		for (var j=0;j<payload.length;j++) {//article
			for (var k=0;k<payload[j].pos.length;k++) {
				pv.push([payload[j].value[k],payload[j].pos[k]]);	
			}
		}
		pv.sort((a,b)=>a[0]-b[0]);//sort by value, will became pos

		const pos=pv.map(a=>a[0]);
		const value=pv.map(a=>a[1]);
		const markups=groupByArticle(pos,value,corpora[corpus]);
		out.push( [corpus, fieldname, markups]);
	}
	return out;
}

const connectCorpus=function(cor,corpora,dispatch){
	const opencorpora=Object.keys(corpora).filter(c=>corpora[c]);
	console.log("connecting",cor.id,"to corpus",opencorpora);
	const output=[],
	links=[];// [source corpus, fieldname@target , source to target]
	var lastjobcor,lastfield;
	for (var db in corpora) {
		const tcor=corpora[db];
		if (!tcor) continue;

		var r=connect(cor,tcor,output,links);
		if (r) {
			lastjobcor=tcor.id;
			lastfield=r;
		}
		r=connect(tcor,cor,output,links);
		if (r) {
			lastjobcor=cor.id;
			lastfield=r;
		}
	}

	if (taskqueue.length) {
		taskqueue.push(function(data){
			output.push(data);
			//dispatch({type:SET_MARKUPS, name:meta.type, corpus, markups});
			links.forEach((j,idx)=>j.push(output[idx]));

			const outputlinks=buildReverseLinks(links,corpora);
			for (var i=0;i<outputlinks.length;i++) {
				const corpus=outputlinks[i][0], name=outputlinks[i][1], markups=outputlinks[i][2];
				dispatch({type:SET_MARKUPS, corpus,name,markups});
			}
		});	
		taskqueue.shift()({__empty:true});
	}
}

module.exports={connectCorpus};