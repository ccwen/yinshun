const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const SearchBox=require("./searchbox");
const SearchOptions=require("./searchoptions");
const ModeSelector=require("./modeselector");
const styles={
	container:{background:"#E0E0E0"},
	selectdb:{cursor:"pointer",borderBottom:"solid 1px blue"}
}
class HomeBar extends React.Component {
	render(){
		const title=this.props.cor.meta.title;
		return E("div",{style:styles.container},
			E("span",{onClick:this.props.selectDB,style:styles.selectdb},title)
			,"　"
			,E(SearchBox,this.props)
			,"　"
			,E(ModeSelector,this.props)
			//,E(SearchOptions,this.props)
		)
	}
};
module.exports=HomeBar;