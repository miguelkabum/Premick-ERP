import React from "react";

const MessageLeft = ({ text, time }) => {
  return (
    <div style={styles.container}>
      <div style={styles.bubble}>
        <div style={styles.textContainer}>
            <div style={styles.text}>
                {text}
            </div>
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
    maxWidth: "250px",
  },
  bubble: {
    backgroundColor: "#5B5B58", // Cor da Mensagem
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "10px",
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
    justifyContent: "flex-start",
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
    left: "-5px",
    width: "0",
    height: "0",
    borderStyle: "solid",
    borderWidth: "10px 0 10px 10px",
    borderColor: "transparent transparent transparent #5B5B58",
    transform: "rotate(90deg)" /* Rotaciona o triângulo */
  },
};

export default MessageLeft;
