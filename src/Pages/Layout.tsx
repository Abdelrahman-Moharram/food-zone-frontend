import React, { Suspense, useEffect } from 'react'
import { useRetrieveUserQuery } from '../redux/features/authApiSlice'
import { useAppDispatch } from '../redux/hooks'
import { setAuth } from '../redux/features/authSlice'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SideNav from '../Components/Shared/Sidebar'
import Header from '../Components/Shared/Header'

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const { data } = useRetrieveUserQuery()
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (data) {
            dispatch(setAuth(data))
        }
    }, [data, dispatch])

    return (
        // 1. Make main h-screen and prevent window scroll
        <main 
            dir={i18n.language == "en" ? "ltr" : "rtl"} 
            className='light h-screen flex flex-col overflow-hidden' 
        >
            {/* Header stays at the top */}
            <Header />

            {/* 2. Wrapper fills remaining height automatically using flex-1 */}
            <div className='flex flex-1 overflow-hidden relative gap-2 p-1'>
                
                {/* 3. SideNav Container: 
                     - h-full: takes full available height
                     - overflow-y-auto: allows scrolling INSIDE the nav if menu is long
                     - No 'fixed' needed, it stays naturally 
                */}
                <SideNav />
                

                {/* 4. Main Content Container:
                     - flex-1: takes remaining width
                     - h-full + overflow-y-auto: Independent scrolling for content
                */}
                <div className="flex-1 h-full overflow-y-auto w-full border rounded-lg bg-container/40"> 
                    <div className=" min-h-full ">
                        <Suspense fallback={<div>Loading...</div>}>
                            {children || <Outlet />}
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Layout