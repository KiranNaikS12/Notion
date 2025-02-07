import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"

export const useAuth = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    console.log("userInfo", userInfo)
    return { isAuthenticated: !!userInfo}
}