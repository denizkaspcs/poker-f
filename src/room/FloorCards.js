import './FloorCards.css';

function FloorCards({c1,c2,c3,c4,c5}) {
  return (
    <div className='flr-card'>
        {c1?        <img  width={77} height={110} src ={c1}></img>:<></>}
        {c2?        <img className="card-flr" width={77} height={110} src ={c2}></img>:<></>}
        {c3?        <img className="card-flr" width={77} height={110} src ={c3}></img>:<></>}
        {c4?        <img className="card-flr" width={77} height={110} src ={c4}></img>:<></>}
        {c5?        <img className="card-flr" width={77} height={110} src ={c5}></img>:<></>}
    </div>
  );
}

export default FloorCards;
