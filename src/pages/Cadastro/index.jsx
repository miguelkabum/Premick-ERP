import styles from "./style.module.css";
import imgCadastro from "../../assets/imgs/imgCadastro.jpg"

const Cadastro = () => {
  return (
    <div id={styles.main}>
      <div id={styles.container}>
        <div id={styles.img}>
          <img src={imgCadastro} alt="" />
        </div>

        <div id={styles.loginParts}>
          <h1 id={styles.title}>Cadastro</h1>

          <form id={styles.formulario} action="">
            <div className={styles.input}>
              <label className={styles.textLabel} htmlFor="">
                Informe seu nome:
              </label>

              <input className={styles.inputBox} type="text" />
            </div>
            <div className={styles.input}>
              <label className={styles.textLabel} htmlFor="">
                Digite seu melhor e-mail:
              </label>

              <input className={styles.inputBox} type="text" />
            </div>

            <div className={styles.input}>
              <label className={styles.textLabel} htmlFor="">
                Crie uma nova senha:
              </label>

              <input className={styles.inputBox} type="Password" />
            </div>
            <div className={styles.input}>
              <label className={styles.textLabel} htmlFor="">
                Digite a senha novamente:
              </label>

              <input className={styles.inputBox} type="Password" />
            </div>
          </form>

          <button id={styles.bnt}>Prosseguir</button>
        </div>
      </div>
    </div>
  );
};
export default Cadastro;
