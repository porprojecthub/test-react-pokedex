import React from 'react';
import './pokedex.style.css'
import Modal from './../modal/modal.component'
import Status from './../status/status.component'

class Pokedex extends React.Component {

    constructor() {
        super();
    
        this.state = {
            myList: [],
            openModal: ''
        };

        this.selectPokemon = this.selectPokemon.bind(this);
        this.addPokemon = this.addPokemon.bind(this);
        this.removePokemon = this.removePokemon.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleMouse = this.handleMouse.bind(this);

      }

      selectPokemon(){
        this.setState({openModal:'open'});
      }

      handleMouse(index,active){
        let myList = [...this.state.myList];
        myList[index] = {...myList[index], active: active};
        this.setState({ myList });
      }

      addPokemon(pokemon){
        pokemon.active = false;
        this.setState({
          myList: [
              ...this.state.myList,
              pokemon
          ]
      })
      }

      removePokemon(id){
        for(let i = 0; i < this.state.myList.length; i++){
          let pokemonId = this.state.myList[i].id;
          if(id.trim().toUpperCase() === pokemonId.trim().toUpperCase()){
            let myList = [...this.state.myList];
            myList.splice(i, 1);
            this.setState({myList: myList});
          }
        }
      }

      closeModal(){
        this.setState({ openModal: ''});
      }

    render() {
        return (
<div>
<div className="header">
    <h1 style={{fontSize:'40px',margin:'8px'}}>My Pokedex</h1>
</div>

<div className="container">
  <div className="content">
  {this.state.myList.map((pokemon,index) => (
    <div className="cards" key={pokemon.id}
    onMouseOver={()=> {this.handleMouse(index,true)}}
    onMouseLeave={()=> {this.handleMouse(index,false)}}>
       <div className="card-item">
          <div className="image"><img src={pokemon.imageUrl} alt={pokemon.name} style={{height:'250px',paddingTop:'10px'}}/></div>
          <div className="data">
            { pokemon.active && <div style={{color:'#e44c4c',cursor:'pointer',float:'right',paddingRight:'20px'}} onClick={() => this.removePokemon(pokemon.id)}>X</div>}
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
<Modal modalStatus={this.state.openModal} selectedList={this.state.myList} onAddPokemon={this.addPokemon} onCloseModal={this.closeModal}/>
<div id="add-button" onClick={this.selectPokemon}>+</div>
<div id="footer-button-panel"/>
<div className="footer"></div>
</div>
        );
    }
}

export default Pokedex;
