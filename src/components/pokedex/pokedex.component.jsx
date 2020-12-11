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
        this.getStatus = this.getStatus.bind(this);
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

            let str = 0;
            if(attacks && attacks.length){
              str = attacks.length * 50;
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
              weakness = weaknesses.length * 100;
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
