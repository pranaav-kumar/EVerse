import { useNavigate } from 'react-router-dom';

function Home2(){
    const navigate = useNavigate();
    return(
    <div>
        <button onClick={()=>navigate("/addstations")}>add station</button>
        <button onClick={()=>navigate("/maintenance")}>Maintenance</button>
    </div>);
}
export default Home2;