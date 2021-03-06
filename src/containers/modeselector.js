const React =require('react');
const E=React.createElement;
const PT=React.PropTypes;
const {_}=require("ksana-localization");
const {DBSELECTOR,BOOKSELECTOR,TOCVIEW,READTEXT,BOOKRESULT,EXCERPTVIEW}=require("../actions/params");
const GroupNav=require("./groupnav");
const styles={
	a:{cursor:"pointer"},
	b:{pointerEvents:"none",color:"black"}
}
class ModelSelector extends React.Component{
	tocView(){
		this.props.setParams({m:TOCVIEW});
	}
	render(){
		const m=this.props.params.m;
		const hasQ=this.props.searchresult.filtered && this.props.params.q;

		return E("span",{},
			E("a",{style:m==BOOKSELECTOR?styles.b:styles.a,onClick:this.props.selectBook},_("Select Book")),
			" ",
			E("a",{style:m==TOCVIEW?styles.b:styles.a,onClick:this.tocView.bind(this)},_("TOC View")),
			" ",
			hasQ?E("a",{style:m==BOOKRESULT?styles.b:styles.a,onClick:this.props.groupByBook},_("Group By Book")):null,
			" ",
			hasQ?E("a",{style:m==EXCERPTVIEW?styles.b:styles.a,onClick:this.props.showExcerpt},_("Excerpt")):null,
			" ",
			m==READTEXT?E(GroupNav,{setA:this.props.setA,address:this.props.params.a,cor:this.props.cor}):null
		)
	}
}

module.exports=ModelSelector;