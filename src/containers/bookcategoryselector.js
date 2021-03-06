const React =require('react');
const E=React.createElement;
const PT=React.PropTypes;
const filterItem=require("../components/filteritem");
const {TOCVIEW}=require("../actions/params");
const {_}=require("ksana-localization");
const styles={
	container:{overflowY:"auto"},
	btn:{marginLeft:"10px"},
	cat:{cursor:"pointer"},
	selectedcat:{cursor:"pointer",background:"lightblue"}

}

class BookCategorySelector extends React.Component {
	constructor(props){
		super(props);
		const res=this.buildCategory();
		this.state=Object.assign({},{selCategory:-1},res);
	}
	buildCategory(props){
		props=props||this.props;
		const rawgroupNames=this.props.cor.groupNames();
		var allOfCat=[],selOfCat=[],groupNames=[],id=[];
		for (var i=0;i<rawgroupNames.length;i++) {
			const r=rawgroupNames[i].split(";");
			id.push(r[0]);
			const r2=r[1].split("@");
			const prefix=parseInt(r2[0]);
			if (!allOfCat[prefix]) allOfCat[prefix]=[];
			allOfCat[prefix].push(groupNames.length);
			groupNames.push(r2[1]);
			if (!props.filter.exclude[i]) {
				if (!selOfCat[prefix]) selOfCat[prefix]=0;
				selOfCat[prefix]++;
			}			
		}
		return {allOfCat,selOfCat,groupNames,id,categoryNames:this.props.cor.meta.groupPrefix};
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.filter.exclude!==this.props.filter.exclude ) {
			this.setState(this.buildCategory(nextProps));
		}
	}
	setExclude(group,value){
		this.props.setExclude(group,value);
	}
	goGroup(group){
		const r=this.props.cor.groupKRange(group);
		const a=this.props.cor.stringify(r[0]);
		this.props.setParams({m:TOCVIEW,a});
	}
	firstOccurOfGroup(group){
		var first=0;
		for(let i=0;i<group;i++) {
			if (!this.props.filter.exclude[i]){
				first+=this.props.filter.hits[i];				
			}
		}
		return first;
	}
	selectCat(key){
		const selCategory=parseInt(key);
		if (this.state.selCategory==selCategory) {
				this.setState({selCategory:-1});	
		} else {
				this.setState({selCategory});	
		}
	}
	checkCat(key){
		const all=this.state.allOfCat[key];
		const sel=this.state.selOfCat[key]||0;

		this.props.setExclude(all,!!sel);		
	}
	renderCategory(item,key){
		const all=this.state.allOfCat[key];
		const sel=this.state.selOfCat[key]||0;
		const selected=this.state.selCategory==key;
		if (!all) return null;
		const checked=!!sel;
		return E("div",{key},"　",
				E("input",{type:"checkbox",checked,onChange:this.checkCat.bind(this,key)}),
			" ", E("span",{style:styles[(selected?"selectedcat":"cat")],
				onClick:this.selectCat.bind(this,key)},item), 
			" ",sel+"/"+all.length,
			selected?E("div",{},E("blockquote",{},all.map(this.renderGroup.bind(this)))):null
			);
	}
	renderGroup(group,key){
		var hit=0;
		if (this.props.showHit) {
			hit=this.props.filter.hits[group] || 0;			
		}
		
		const exclude=this.props.filter.exclude[group] || false;
		var br=false;
		var g=this.state.groupNames[group];
		if (g.substr(0,2)=="\\n") {
			g=g.substr(2);
			br=true;
		}
		const label=g.replace(/.*;/,"");
		const hint=this.state.id[group] ;//g.replace(/;.*/,"");
		return E(filterItem,{parentElement:"span",label,hit,exclude,key:group,br,idx:group,hint,idx:group,
			setExclude:this.setExclude.bind(this),goGroup:this.goGroup.bind(this)});
	}
	selectall(){
		this.props.includeAll();
	}
	deselectall(){
		this.props.excludeAll();
	}
	render(){
		return E("div",{style:styles.container},
			E("button",{style:styles.btn,onClick:this.selectall.bind(this)},_("Select All")),
			E("button",{style:styles.btn,onClick:this.deselectall.bind(this)},_("Deselect All")),
			this.state.categoryNames.map(this.renderCategory.bind(this)));	
	}
};
BookCategorySelector.propTypes={
		filter:PT.object.isRequired
}
module.exports=BookCategorySelector;