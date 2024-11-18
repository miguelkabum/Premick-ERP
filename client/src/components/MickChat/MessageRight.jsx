import React from "react";

const MessageRight = ({ text, time }) => {
  return (
    <div style={styles.container}>
      <div style={styles.bubble}>
        <div style={styles.textContainer}>
            <p style={styles.text}>
                {text}
            </p>
        </div>
        <div style={styles.footer}>
          <span style={styles.time}>{time}</span>
        </div>
      </div>
      <div style={styles.tail}></div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "inline-block",
    margin: "0",
    maxWidth: "400px",
    minWidth: "200px",
  },
  bubble: {
    backgroundColor: "#075E54", // Cor da Mensagem
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "10px",
    borderBottomLeftRadius: "10px",
    padding: "10px",
    color: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  textContainer: {
    marginBottom: "5px",
  },
  text: {
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.5",
    wordWrap: "break-word"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: "12px",
    color: "#D1D1D1",
  },
  time: {
    marginRight: "0",
  },
  tail: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    width: "0",
    height: "0",
    borderStyle: "solid",
    borderWidth: "10px 0 10px 10px",
    borderColor: "transparent transparent transparent #075E54",
    transform: "rotate(90deg)" /* Rotaciona o triângulo */
  },
};

export default MessageRight;
