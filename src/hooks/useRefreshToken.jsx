import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        const accessToken = response.data.accessToken;
        const roles = response.data.roles;

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(accessToken);
            return {
                ...prev,
                accessToken,
                roles
            };
        });

        return accessToken;
    }

    return refresh;
}

export default useRefreshToken;
