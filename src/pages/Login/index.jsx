import styles from './style.module.css'
import imgLogin from '../../assets/imgs/imgLogin.jpg'

import {Link} from 'react-router-dom'

const Login = () => {
  return(
    <div id={styles.main}>
      <div id={styles.container}>

        <div id={styles.img}>
          <img src={imgLogin} alt="" />
        </div>

        <div id={styles.loginParts}>
          <h1 id={styles.title}>Login</h1>

          <form id={styles.formulario} action="">

            <div className={styles.input}>

            <label 
            className={styles.textLabel} 
            htmlFor="">
              Usuário ou e-mail
            </label>

            <input className={styles.InputBox} type="text" />

            </div>

            <div className={styles.input}>

            <label 
            className={styles.textLabel} 
            htmlFor=""
            >
              Senha
            </label>

            <input className={styles.inputBox} type="Password" />

            </div>

          </form>

          <button id={styles.btn}>Entrar</button>

          <p id={styles.link}>Esqueceu sua senha?</p>
          <div className={styles.other}>
          <p>Ainda não tem um cadastro?</p>

          <Link to='/Cadastro'>
            <p id={styles.link}>Inscreva-se agora!</p>
          </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
export default Login;
