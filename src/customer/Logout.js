
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Logout(){

    const navigate = useNavigate();

    useEffect(() => {
        
        const token = localStorage.getItem('tokens');
        if (token) {
            localStorage.removeItem('tokens');
            navigate('/login')
          }
        
      }, [navigate]);
    

   
}
export default Logout