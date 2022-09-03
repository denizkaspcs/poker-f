import './Entry.css';
import axios from 'axios'
import React,{useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Entry() {
    const [create, setCreate] = useState(false);
    const [enter, setEnter] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [money, setMoney] = useState();
    const [smallBlind, setSmallBlind] = useState();

    const navigate = useNavigate();

    const on_change_id = (event) => {
        setRoomId(event.target.value);
    }
    const on_change_name = (event) => {
        setPlayerName(event.target.value);
    }
    const get_deck = async () => {
        axios.get(`http://localhost:8080/get_deck?room_id=${roomId}`).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err);
        })
    }
    const on_submit = async () => {
        if (create) {
            await axios.post('http://localhost:8080/createRoom', {
                id: roomId,
                name: playerName,
                money: money,
                small_blind: smallBlind
            }).then((results) => {
                let url = "/room/" + roomId;
                navigate(url, { state: { roomId: roomId, name: playerName, participants:[],participant_id:results.data.participant_id } })
                console.log(results)
            }).catch((err) => {
                console.log(err)
            });
            
            await get_deck();

        } else {
            await axios.post('http://localhost:8080/enterRoom', {
                id: roomId,
                name: playerName
            }).then((results) => {
                let url = "/room/" + roomId;
                console.log(results)
                navigate(url, { state: { roomId: roomId, name: playerName , participants: results.data.room.participants,participant_id:results.data.participant_id} })
            }).catch((err) => {
                console.log(err)
            })

        }
    }
    const create_room = () => {
        setCreate(true);
    }
    const enter_room = () => {
        setEnter(true);
    }
    const on_close = () => {
        setCreate(false);
        setEnter(false);
    }


    return (
        <div className="Entry">
          <div className='box'>
            {
                  (create || enter) === false ? 
                <>
                    <button className='button' onClick={create_room}>Create Room</button>
                    <button className='button' onClick={enter_room}>Enter Room</button>
                </>
                        :
                <div className="set">
                    <label className='close' onClick={on_close}>X</label>        
                    <div className='sbm-wrp'>
                        <input onChange={on_change_id} className='inp' placeholder='Room ID'></input>
                        <input onChange={on_change_name} className='inp' placeholder='Player Name'></input>
                        {
                            create ? 
                                <>
                                    <input onChange={(event) => {setMoney(event.target.value)}} className='inp' placeholder='Player $$'></input>
                                    <input onChange={(event) => {setSmallBlind(event.target.value)}} className='inp' placeholder='Small Blind'></input>            
                                </>
                                        :
                                <></>
                        }
                
                        
                        <button onClick={on_submit} className='sbm'>{create === true ? "Create" : "Enter"}</button>
                    </div>
                </div>
            }
        </div>
    </div>
  );
}

export default Entry;
