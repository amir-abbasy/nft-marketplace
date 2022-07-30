import { useState, useEffect, useRef } from 'react'
import '../styles/Menu.module.css'
import Link from 'next/link'


const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false)

  let ref = useRef()

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdown])

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true)
  }

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false)
  }

  return (
    <li
      className="menu-items mr-4"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{' '}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : (
        <Link href={items?.route ? items?.route : '#'}>{items.title}</Link>
      )}
    </li>
  )
}

// export default MenuItems;

// import MenuItems from "./MenuItems";
const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : ''
  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? 'show' : ''}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  )
}

// export default Dropdown;

const Navbar = (props) => {
  return (
    <nav>
      <ul className="menus">
        {props?.options.map((menu, index) => {
          const depthLevel = 0
          return <MenuItems items={menu} key={index} depthLevel={depthLevel} />
        })}
      </ul>
    </nav>
  )
}
export default Navbar

//  Default Props
const options = [
  { title: 'Home', route: '/home' },
  { title: 'Explore', route: '/Explore'  },
  // { title: 'Stats' , route: '/ConnectWallet'},
  // {title: "Resourses",},
  // {title: "Create",},
  // {title: "Profile",},
  // {title: "Wallet",},
  // {
  //   title: 'Resourses',
  //   submenu: [
  //     {
  //       title: 'web design',
  //     },
  //     {
  //       title: 'web development',
  //       submenu: [
  //         {
  //           title: 'Frontend',
  //         },
  //         {
  //           title: 'Backend',
  //           submenu: [
  //             {
  //               title: 'NodeJS',
  //             },
  //             {
  //               title: 'PHP',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'SEO',
  //     },
  //   ],
  // },
  {
    title: 'Create',
    route: '/CreateNFT',
    // submenu: [
    //   {
    //     title: 'Who we are',
    //   },
    //   {
    //     title: 'Our values',
    //   },
    // ],
  },
]

Navbar.defaultProps = {
  options: options,
}
