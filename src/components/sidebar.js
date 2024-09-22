import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    CCloseButton,
    CImage,
    CSidebar,
    CSidebarBrand,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { SidebarNav } from './sidebarNav'
import _nav from '../_nav'

const Sidebar = () => {
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.layout.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.layout.sidebarShow)

    return (
        <CSidebar
            className="border-end"
            colorScheme="dark"
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end', float: 'right', margin: '5px 5px' }}>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </div>
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand to="/">
                    <CImage src={'./public/carlogo.png'} alt="Car Logo" style={{ objectFit: 'cover', borderRadius: '10px' }} height={140} width={210} />
                    <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
                </CSidebarBrand>

            </CSidebarHeader>
            <SidebarNav items={_nav} />
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(Sidebar)
