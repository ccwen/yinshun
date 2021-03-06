const  { SET_PARAMS,BOOKSELECTOR} = require('../actions/params');

const initState={
	q:"",
	m:BOOKSELECTOR, //modes, see mainscreen
	n:0, //showing
	ex:"" //exclude book bits
}

module.exports=function params(state = initState, action = {}) {
  switch (action.type) {
  case SET_PARAMS:
  	if (!action.m) {
  		action.m=BOOKSELECTOR;
  	}
		var newstate=Object.assign({},state,action);
		delete newstate.type;
		if (typeof newstate.n!=="undefined") newstate.n=parseInt(newstate.n);
		if (typeof newstate.m!=="undefined") newstate.m=parseInt(newstate.m);
		return newstate;
  default:
    return state;
  }
}