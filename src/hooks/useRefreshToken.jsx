import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        const accessToken = response.data.accessToken;

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(accessToken);
            return {
                ...prev,
                accessToken
            };
        });

        return accessToken;
    }

    return refresh;
}

export default useRefreshToken;
