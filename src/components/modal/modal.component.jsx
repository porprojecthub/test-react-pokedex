import React from 'react';
import './modal.style.css'
import axios from 'axios'
import Status from './../status/status.component'

class Modal extends React.Component {

    constructor(props) {
        super(props);

        this.myModal = React.createRef();
    
        this.state = {
          masterList: [],
          dataList:[],
          criteria:{name:'',type:'',limit:'20'},
        };

        this.initData = this.initData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.searchPokemon = this.searchPokemon.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.selectPokemon = this.selectPokemon.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.handleCriteriaChange = this.handleCriteriaChange.bind(this);
        this.handleMouse = this.handleMouse.bind(this);

      }

      componentDidUpdate(prevProps) {
        if(prevProps.modalStatus !== this.props.modalStatus){
            if (this.props.modalStatus === 'open') {
              this.myModal.current.style.display = "block";
              this.initData();
            }else{
              this.myModal.current.style.display = "none";
              this.clearData();
            }
          }
       }

       handleCriteriaChange(e){
         this.setState({
          criteria: {
            ...this.state.criteria,
            [e.target.name]: e.target.value
          }
        });
      };

      handleMouse(index,active){
        let dataList = [...this.state.dataList];
        dataList[index] = {...dataList[index], active: active};
        this.setState({ dataList });
      }

      async initData(){

        let response = await axios.get('http://localhost:3030/api/cards').then(resp => resp.data.cards.map(pokemon => {
          return this.getStatus(pokemon);
        }))

        this.setState(() => ({masterList: response}));
  
          if(this.props.selectedList.length){
            for(let i = 0; i < this.state.masterList.length; i++){
              let mId = this.state.masterList[i].id
              for(let j = 0; j < this.props.selectedList.length; j++){
                let sId = this.props.selectedList[j].id
                if(mId.trim().toUpperCase() === sId.trim().toUpperCase()){
                  let masterList = [...this.state.masterList];
                  masterList.splice(i, 1);
                  this.setState({masterList: masterList});
                  i = i-1
                  continue;
                }
              }
            }
          } 
  
          this.setState({dataList: this.state.masterList});
          
      }

      clearData(){
        this.setState({
          masterList: [],
          dataList: [],
          criteria: {name:'',type:'',limit:'20'}
        });
      }

      async searchPokemon(){
        let limit = this.state.criteria.limit || '';
        let name = this.state.criteria.name || '';
        let type = this.state.criteria.type || '';
  
       let response = await axios.get(`http://localhost:3030/api/cards?limit=${limit}&name=${name}&type=${type}`).then(resp => resp.data.cards.map(pokemon => {
            return this.getStatus(pokemon);
          }));

      this.setState(() => ({masterList: response}));
  
          if(this.props.selectedList.length){
            for(let i = 0; i < this.state.masterList.length; i++){
              let mId = this.state.masterList[i].id;
              for(let j = 0; j < this.props.selectedList.length; j++){
                let sId = this.props.selectedList[j].id;
                if(mId.trim().toUpperCase() === sId.trim().toUpperCase()){
                  let masterList = [...this.state.masterList];
                  masterList.splice(i, 1);
                  this.setState({masterList: masterList});
                  i = i-1;
                  continue;
                }
              }
            }
          } 
  
        this.setState({dataList: this.state.masterList});
  
      }

      closeModal(e){
        if(e.target.id === "myModal"){
          this.props.onCloseModal();  
        }
      }

      selectPokemon(pokemon){
        if(pokemon){
          this.props.onAddPokemon(pokemon); 
          this.searchPokemon();
        }
  
      }

      getStatus(pokemon){
  
          if(pokemon){
  
              let {hp, attacks, weaknesses } = pokemon;
  
              if(hp){
                if(parseInt(hp) > 100){
                    hp = 100;
                }else if (isNaN(hp)){
                    hp = 0;
                }
              }
  
              pokemon.hpStatus = hp || 0;
  
              let str = 0
              if(attacks && attacks.length){
                str = attacks.length * 50
                if(str > 100){
                    str = 100;
                }else if (str === 1){
                    str = 50;
                }else if (str === 2){
                    str = 100;
                }
              }
  
              pokemon.strStatus = str;
  
              let weakness = 0;
              if(weaknesses && weaknesses.length){
                weakness = weaknesses.length * 100
                if((weakness > 100) || (weakness === 1)){
                    weakness = 100;
                }else{
                  weakness = 0;
                }
              }
  
              pokemon.weakStatus = weakness;
  
              let damage = 0;
              if(attacks && attacks.length){
                  let dmg = 0;
                  for(let i = 0; i < attacks.length; i++){
                      let atk = attacks[i];
                      if(atk.damage && !isNaN(atk.damage)){
                          dmg += parseInt(atk.damage.replace(/[^0-9]/gi, ""));
                      }
                  }
                  damage = dmg;
              }
  
  
              let happy = (((parseInt(hp) / 10) + (damage /10 ) + 10 - (weakness)) / 5) || 0;
  
              pokemon.happyStatus = Math.ceil(happy);
              
  
          }
  
          pokemon.active = false;
  
          return pokemon;
  
        }

    render() {

        return (
<div id="myModal" className="modal" ref={this.myModal}  onClick={this.closeModal}>
  <div className="modal-content">
    <div className="container">
  <div className="content-modal">
    <div className="form-input">
      <div className="input-container" style={{paddingLeft:'30px'}}>
      <input className="input-field" style={{fontSize:'20px'}} type="text" placeholder="Pokemon Name" name="name" value={this.state.criteria.name} onChange={this.handleCriteriaChange}/>
        <input className="input-field" style={{fontSize:'20px'}} type="text" placeholder="Pokemon Type" name="type" value={this.state.criteria.type} onChange={this.handleCriteriaChange}/>
        <select className="input-field" style={{fontSize:'20px'}} name="limit" value={this.state.criteria.limit}  onChange={this.handleCriteriaChange}>
           <option value="20">Show 20</option>
           <option value="50">Show 50</option>
           <option value="100">Show 100</option>
         </select>
      <i className="fa fa-search icon" style={{color:'#e44c4c',fontSize:'40px',cursor:'pointer'}} onClick={this.searchPokemon}/> 
      </div>
    </div>
    {this.state.dataList.map((pokemon,index) => (
    <div className="cards-modal" key={pokemon.id}
    onMouseOver={()=> {this.handleMouse(index,true)}}
    onMouseLeave={()=> {this.handleMouse(index,false)}}>
       <div className="card-item">
          <div className="image"><img src={pokemon.imageUrl} alt={pokemon.name} style={{height:'250px',paddingTop:'10px'}}/></div>
           <div className="data">
             {pokemon.active && <div style={{color:'#e44c4c',cursor:'pointer',float:'right',paddingRight:'20px'}} onClick={() => this.selectPokemon(pokemon)}>Add</div>}
             <div className="name" style={{paddingTop:'8px',paddingLeft:'10px'}}>
    <span style={{fontSize:'30px',fontWeight:'400',fontFamily:'Gaegu'}}>{pokemon.name}</span>
             </div>
             <div className="status" style={{paddingLeft:'12px'}}>
              <div className="hp" style={{paddingBottom:'8px'}}>
                  <span>HP</span>
                  <Status value={pokemon.hpStatus} type={'hp'} />
                </div>
                <div className="str" style={{paddingBottom:'10px'}}>
                  <span>STR</span>
                  <Status value={pokemon.strStatus} type={'str'} />
                </div>
                <div className="weak" style={{paddingBottom:'18px'}}>
                  <span>WEAK</span>
                  <Status value={pokemon.weakStatus} type={'weak'}/>
                </div>
             </div>
             <div className="happy" style={{paddingLeft:'12px'}}>
               {Array.from(Array(parseInt(pokemon.happyStatus)), (e, i) => {
                return <img key={i} height="30px" alt={pokemon.happyStatus} src={'./image/omyim.png'}/>
              })}
              </div>
        </div>
      </div>
    </div>
    ))}
</div>
  </div>
  </div>
</div>
        );
    }
}

export default Modal;
