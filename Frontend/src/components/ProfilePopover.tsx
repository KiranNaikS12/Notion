import { Listbox, ListboxItem, PopoverContent } from '@heroui/react'
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/store/store';

interface ListboxWrapperProps {
    children: React.ReactNode
}

export const ListboxWrapper: React.FC<ListboxWrapperProps> = ({ children }) => (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);

const ProfileHover: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.user);
    const id = userInfo?._id;
    return (
        <PopoverContent>
            <ListboxWrapper>
                <Listbox aria-label="Actions"  variant='shadow'>
                    <ListboxItem key="profile">
                        <Link to={`/profile/${id}`}>
                        My Profile
                        </Link>
                    </ListboxItem>
                    <ListboxItem key="article">
                        <Link to = '/articles'>
                            My Articles
                        </Link>
                    </ListboxItem>
                    <ListboxItem key="logout" className="text-danger" color="danger">
                        Logout
                    </ListboxItem>
                </Listbox>
            </ListboxWrapper>
        </PopoverContent>

    )
}

export default ProfileHover
