import './Bid.css';
import axios from 'axios'
import React,{useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ReactSlider from 'react-input-slider'
function Bid({money,current_bid,big_blind,bid_func,can_bid,on_fold}) {
    const [x, setX] = useState(200);
    const [value, setValue] = useState(0);
    const on_bid = () => {
        if (x >= money) {
            bid_func(money);
        } else if (x <= current_bid) {
            bid_func(current_bid);            
        } else {
            bid_func(parseInt(x));        
        }
        setX((money - current_bid) / 2);

        
    }
    const onfold = () => {
        on_fold(0);
    }

    const on_change = (event) => {
        setX(event.target.value);
    }
    return (
        <div className="bid-box">
            <div className='bid-comp'>
                <label className='bid-money'>Money : {money}</label>
                <label className='bid-cur-bid'>Current bid: {current_bid}</label>
                <div></div>
                <input onChange={on_change} value={x}></input>
                <ReactSlider
                    axis='x'
                    xstep={big_blind}
                    xmin={current_bid}
                    xmax={money}
                    x={x}
                    onChange={(x) => {setX(x.x)}}
                />
                <button disabled={can_bid} className='bid-btn' onClick={on_bid}>Bid</button>
                <button disabled={can_bid} className='bid-btn' onClick={onfold}>Fold</button>
            </div>
        </div>
  );
}

export default Bid;
