import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  Image,
  Modal,
  Button
} from 'react-native';

import io from 'socket.io-client';


const NAME = '@kathelop';
const CHANNEL = 'Random';
const AVATAR = "https://imagenmix.net/wp-content/uploads/2016/10/imagenes-con-frase-positiva.png";

export default class App extends Component {
  state = {
    typing: '',
    messages: [],
    showModal: true,
    nickname: ''
  };

  componentDidMount() {
    this.socket = io.connect('http://chatroomrn.us.openode.io:80');
    this.listenMessage();
  }

  listenMessage(){
    this.socket.on('new_message', ( data ) => {
      let newMessage = {
        avatar: data.avatar,
        username: data.username,
        message: data.message
      };
      this.setState({
        messages: [...this.state.messages, newMessage]
      })
    })
  }

  renderItem({ item }) {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <View style={styles.rowText}>
          <Text style={styles.sender}>{item.username}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  }

  sendMessage = () => {
    /*this.setState({
      messages: [...this.state.messages, { username: NAME, avatar: AVATAR, message: this.state.typing }]
    })*/
    this.socket.emit('new_message', { message: this.state.typing })
    this.setState({
      typing: ''
    })
  } 

  keyExtractor = () => Math.floor((Math.random() * 1000) + 1).toString()

  enterRoom = () => {
    this.socket.emit('change_username', { username: this.state.nickname, avatar: AVATAR })
    this.setState({ showModal: false })
  }

  renderModal() {
    return (
      <Modal animationType="slide"
        visible={this.state.showModal}
        onRequestClose={() => { }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.inputNickname}
            placeholder={'@nickname'}
            onChangeText={text => this.setState({ nickname: text })}
          />
          <Button title="Ingresar al chat"
            onPress={this.enterRoom}
          />
        </View>
      </Modal>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderModal()}
        <FlatList
          data={this.state.messages}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.footer}>
            <TextInput
              value={this.state.typing}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Type something nice"
              onChangeText={text => this.setState({ typing: text })}
              onSubmitEditing={this.sendMessage}
            />
            <TouchableOpacity onPress={this.sendMessage}>
              <Text style={styles.send}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  rowText: {
    flex: 1
  },
  message: {
    fontSize: 18
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  inputNickname: {
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
});