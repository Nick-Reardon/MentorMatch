import React, { useState, useEffect } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import { IconContext } from "react-icons/lib"
import logo from "../../images/logo-graph.png"
import Button from "../Button"
import {
  Nav,
  NavbarContainer,
  NavIcon,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavItemBtn,
  NavLinks,
  NavBtnLink,
} from "./Navbar.elements"

function Navbar({ setAuth, isAdmin, newMessage }) {
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  }

  useEffect(() => {
    showButton()
  }, [])

  window.addEventListener("resize", showButton)

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavbarContainer>
            <NavLogo to="/" onClick={closeMobileMenu}>
              <NavIcon src={logo} alt="scratchLogo" />
            </NavLogo>
            <MobileIcon onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </MobileIcon>
            <NavMenu onClick={handleClick} click={click}>
              <NavItem>
                <NavLinks to="/requests">Requests</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="/settings">Settings</NavLinks>
              </NavItem>
              <NavItemBtn>
                <Button
                  variant="fill"
                  size="medium"
                  onClick={(e) => {
                    localStorage.clear()
                    setAuth(false)
                  }}
                >
                  Log Out
                </Button>
              </NavItemBtn>
            </NavMenu>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  )
}

export default Navbar
