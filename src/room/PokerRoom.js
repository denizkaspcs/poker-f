import { useState,useEffect } from 'react';
//import './PokerRoom.css'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import PlayerBox from '../player/PlayerBox';
import io from 'socket.io-client';
import Bid from '../player/Bid';
import FloorCards from './FloorCards';
import './Round.css';

/*
                if (response.data.participant.hand.length != 0) {
                    setFCard(response.data.participant.hand[0]);
                    setSCard(response.data.participant.hand[1]);
                }

*/

function PokerRoom() {
    const location = useLocation();
    const [king, setKing] = useState(false);
    const [participantId, setParticipantId] = useState(-1);
    const [fCard, setFCard] = useState("http://www.deckofcardsapi.com/static/img/back.png");
    const [sCard, setSCard] = useState("http://www.deckofcardsapi.com/static/img/back.png");
    const [links, setLinks] = useState([]);
    const [socket, setSocket] = useState(null);
    const [bidding, setBidding] = useState(true);
    const [role, setRole] = useState("player");
    const [money, setMoney] = useState();
    const [currentBid, setCurrentBid] = useState(0);
    const [pot, setPot] = useState();
    const [smallBlind, setSmallBlind] = useState();
    const [hasPaid, setHasPaid] = useState(0);
    const [floorCards, setFloorCards] = useState([]);
    const [turnOver, setTurnOver] = useState(false);
    useEffect(() => {
        const newSocket = io(`https://abiler-poker-back.herokuapp.com`);
        setSocket(newSocket);
        return () => newSocket.close();
    },[setSocket])
  
    useEffect(() => {
        if (!socket) return;
        
        socket.on('enter', (msg) => {
            console.log(msg)
            setLinks(msg.participants);
            setSmallBlind(msg.small_blind);
            setCurrentBid(msg.current_bid);
            setPot(msg.pot);
        });
        socket.on('get_participants', (room) => {
            get_participant();
            if (participantId === room.bidding) {
                setBidding(false);
            }
            setTurnOver(room.turn_over);
            setFloorCards(room.floor_cards);
            setLinks(room.participants);
            setSmallBlind(room.small_blind);
            setCurrentBid(room.current_bid);
            setPot(room.pot);
            for (let i = 0; i < room.participant_count; i++){
                if (room.participants[i].participant_id == participantId) {
                    setMoney(room.participants[i].money);
                    setHasPaid(room.participants[i].has_paid)
                }
            }
            console.log(room);
        })
        socket.on('new_round', (obj) => {
            //reset the game state to start
            setBidding(true);
            setRole("Player");

        })
        socket.on('get_state', (obj) => {
            if (obj.bidding === participantId) {
                setBidding(false);
            }
            for (let i = 0; i < obj.participant_count; i++){
                if (obj.participants[i].participant_id == participantId) {
                    setMoney(obj.participants[i].money);
                    setHasPaid(obj.participants[i].has_paid)
                }
            }
            setTurnOver(obj.turn_over);
            setLinks(obj.participants);
            setCurrentBid(obj.current_bid);
            setPot(obj.pot);
        })
        socket.on('draw_cards', (obj) => {
            console.log("FUCK BIDDING WAITING FOR CARDS")
            console.log(obj)
            
            setFloorCards(obj.floor_cards);
            setLinks(obj.participants);
            setPot(obj.pot);
            if (obj.bidding === participantId) {
                setBidding(false);
            }
            setCurrentBid(obj.current_bid);
            for (let i = 0; i < obj.participant_count; i++){
                if (obj.participants[i].participant_id == participantId) {
                    setMoney(obj.participants[i].money);
                    setHasPaid(obj.participants[i].has_paid)
                }
            }
            
        })

    },[socket])

    useEffect(() => {
        get_participant();
        setLinks(location.state.participants);
        setParticipantId(location.state.participant_id);
    }, []);
//                location.state.name
    const get_participant = async () => {
        await axios.get(`https://abiler-poker-back.herokuapp.com/get_participant?room=${location.state.roomId}&name=${location.state.name}`).then((response) => {
                console.log(response)
            if (response && response.data && response.data.statusCode === 200) {
                console.log(response)
                //might need to delete
                const temp = response.data.participant.participant_id;
                setParticipantId(temp);
                setRole(response.data.participant.role);
                setKing(response.data.participant.king);
                setMoney(response.data.participant.money);
                if (response.data.participant.hand.length != 0) {
                    setFCard(response.data.participant.hand[0]);
                    setSCard(response.data.participant.hand[1]);
                }


            }
        }).catch((err) => {
            console.log(err);
        })
        return;
    }

    const start = async () => {
        axios.get(`https://abiler-poker-back.herokuapp.com/start?room_id=${location.state.roomId}`).then((response) => {
            console.log("hello: ")
            console.log(response);
            socket.emit('start', location.state.roomId);
        })
    }

    const tempa = async () => {
        console.log(fCard);
        console.log(sCard);
    }

    const on_bid = (x) => {
        let obj = {
            name: location.state.name,
            room: location.state.roomId,
            bid: x,
            has_paid : hasPaid,
            id: participantId,
            has_folded: false,
        }
        socket.emit('new_bid', obj);
        setBidding(true);
    }
    const on_fold =  (x) => {
        let obj = {
            name: location.state.name,
            room: location.state.roomId,
            bid: x,
            has_paid : hasPaid,
            id: participantId,
            has_folded: true,
        }
        socket.emit('new_bid', obj);
        setBidding(true);

    }
    const go = async () => {

    }
    //<PlayerBox name={location.state.name} fcard={fCard} scard={sCard} role={role} money={money} />
            
    return (
        <div className='room' style={{backgroundImage:"https://wallpaperaccess.com/full/1483382.jpg"}}>
            <h1 className='pot'>POT : {pot}</h1>
            {turnOver?<h1>TURN IS OVER</h1>:""}            


            <div className='round'>
                <div className='player'>
                    <div className='pbox-hot'>
                        <PlayerBox hasPaid={hasPaid} name={location.state.name} fcard={fCard} scard={sCard} role={role} money={money} />
                    </div>
                    {
                        links.map(({ name, hand,role,money,has_paid }) => {
                            if(name != location.state.name)
                                return <div className='pbox-hot'><PlayerBox hasPaid={has_paid} name={name} fcard={"http://www.deckofcardsapi.com/static/img/back.png"} scard={"http://www.deckofcardsapi.com/static/img/back.png"} role={ role} money={money} /></div>
                        })
                    }
                    <div className='floor-cards'>
                        <FloorCards c1={floorCards[0]} c2={floorCards[1]} c3={floorCards[2]} c4={floorCards[3]} c5={floorCards[4]}/>
                    </div>


                </div>
            </div>
            {
                king ? <button onClick={start} className='str-btn'>start</button> : <></>
            }
            <button  onClick={go} className='str-btn2'>go</button>
            <div className='bid'>
                <Bid money={money} on_fold={on_fold} current_bid={(currentBid - hasPaid)} big_blind={smallBlind} bid_func={on_bid } can_bid={bidding} />
            </div>
        </div>

    );
}

export default PokerRoom