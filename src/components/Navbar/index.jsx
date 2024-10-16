import React from 'react'
import styles from './style.module.css'

import Home from '../../pages/Home'
import Login from '../../pages/Login'
import Cadastro from '../../pages/Cadastro'

import {BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import {Link} from 'react-router-dom'

const index = () => {
  return (
    

        <nav>
          <ul className={styles.mainNav}>
            
            <Link to='/' id={styles.logo}>
                <li id={styles.logo}>
                  <img src="../../../src//assets/icons/logoExample.png" alt="" />
                </li>
              
            </Link>
            
            
            
            <li className={styles.suprimentos}>Suprimentos</li>
            <li id={styles.vendas}>Vendas</li>
            <li id={styles.finanças}>Finanças</li>
            <li className={styles.servicos}>Serviços</li>

            <Link to='/Login'>
              <li id={styles.contabilidade}>Contabilidade</li>
            </Link>
            
          </ul>

          <ul className={styles.userActions}>

            <li id={styles.notifications}><img src="../../../src/assets/icons/notifications.svg"/></li>
            <li id={styles.profile}><img src="../../../src/assets/icons/user.svg"/></li>
            <div id={styles.division}></div>
            <li id={styles.settings}><img src="../../../src/assets/icons/settings.svg"/></li>
            <li id={styles.help}><img src="../../../src/assets/icons/help.svg"/></li>

            <Link to='/Login'>
              <li id={styles.logout}><img src="../../../src/assets/icons/logout.svg"/></li>
            </Link>
            
            
          </ul>

          </nav>
  )
}

export default index