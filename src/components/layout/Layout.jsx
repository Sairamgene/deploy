import { Flex, Footer, View } from '@adobe/react-spectrum'
import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import './Layout.css';

const Layout = (props) => {

    // const [height, setHeight] = useState(window.innerHeight);
    // const [width, setWidth] = useState(window.innerWidth);

    // useEffect(() => {
    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     }
    // },[])

    // const handleResize = () => {
    //     setHeight(window.innerHeight);
    // } 

    // console.log(height)

    return (
        <div className="layout-container">
            
            {/* NAVIGATION */}
            <header><Navbar></Navbar></header>

            {/* BODY */}
            <main className="layout-content-container">
                {props.children}
            </main>

            {/* FOOTER */}
            <footer className="layout-footer">
                <Flex justifyContent="center" height="size-700">
                    <View alignSelf="center">&copy; Bugsy CRM, Inc. All rights reserved.</View>
                </Flex>
            </footer>
            
        </div>
    )
}

export default Layout
