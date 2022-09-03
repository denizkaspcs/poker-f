import './PlayerBox.css';
import axios from 'axios'
import React,{useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function PlayerBox({name,fcard,scard,role,money,hasPaid}) {

    return (
        <div className="player-box">
            <div className='pbox'>
                <div className='top-pbox'>
                    <div className='top-player-status'>
                        <label className='name-label'>{name}</label>
                        {
                            role === "Dealer" ?
                            <img className='icon-dealer' width={25} height={25} src={"https://cdn-icons-png.flaticon.com/512/105/105753.png"}></img>
                                :
                            <></>
                        }
                    </div>

                    <label className='bugdet'>Money:  {money}</label>
                </div>
                <div className='haspaid'>
                    {"$"+hasPaid}
                </div>
                <div className='cards'>
                    <img className='fcard' width={50} height={75} src = {fcard}></img>
                    <img className='scard' width={50} height={75} src = {scard}></img>
                </div>  
                <div className='role'>
                    <label>
                        {role}
                    </label>
                </div>
            </div>
        </div>
  );
}

export default PlayerBox;
