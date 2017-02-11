const React =require('react');
const E=React.createElement;
const PT=React.PropTypes;
const {openCorpus}=require("ksana-corpus");
const styles={
	container:{paddingLeft:"20px"},
	active:{fontSize:"200%"},
	db:{cursor:"pointer",fontSize:"200%",border:"solid 1px black",borderRadius:"5px"}
}
class DBSelector extends React.Component {
	constructor(props){
		super(props);
		this.state={corpora:{}};
	}
	selectdb(db){
		if (db==this.props.activeCorpus)return;
		this.props.setC(db);
	}
	renderDB(item,key){
		const active=item==this.props.activeCorpus;
		const cor=openCorpus(item);
		var title=item;
		if (!cor) {
			openCorpus(item,function(err,db){
				setTimeout(function(){
					this.setState({corpora:Object.assign({},this.state.corpora,{[item]:db})});
				}.bind(this),100);
			}.bind(this))
		} else {
			title=cor.meta.title;
		}
		return E("div",{key,style:styles.container},
			E("span",{style:styles[active?"active":"db"],onClick:this.selectdb.bind(this,item)},title)
			,E("span",{},active?"選取中":null)
		);
	}
	render(){
		return E("div",{},this.props.corpora.map(this.renderDB.bind(this)));
	}
}

module.exports=DBSelector;