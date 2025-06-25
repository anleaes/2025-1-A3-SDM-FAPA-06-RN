import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

type Cliente = {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  cell_phone: string;
  email: string;
  passcode: string;
};

const API_URL = 'http://localhost:8081/Cliente/'; 

const ClienteScreen = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // READ
  const fetchClientes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!firstName || !lastName || !address || !cellPhone || !email || !passcode) return;
    try {
      if (editingId) {
        // UPDATE
        await fetch(`${API_URL}${editingId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            address,
            cell_phone: cellPhone,
            email,
            passcode,
          }),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            address,
            cell_phone: cellPhone,
            email,
            passcode,
          }),
        });
      }
      setFirstName('');
      setLastName('');
      setAddress('');
      setCellPhone('');
      setEmail('');
      setPasscode('');
      setEditingId(null);
      setShowForm(false);
      fetchClientes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente.');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchClientes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o cliente.');
    }
  };

  // EDIT
  const handleEdit = (cliente: Cliente) => {
    setFirstName(cliente.first_name);
    setLastName(cliente.last_name);
    setAddress(cliente.address);
    setCellPhone(cliente.cell_phone);
    setEmail(cliente.email);
    setPasscode(cliente.passcode);
    setEditingId(cliente.id);
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>
      <Button
        title={showForm ? "Fechar formulário" : "Novo cliente"}
        onPress={() => setShowForm(!showForm)}
      />
      {showForm && (
        <ScrollView style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Sobrenome"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone celular"
            value={cellPhone}
            onChangeText={setCellPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={passcode}
            onChangeText={setPasscode}
            secureTextEntry
          />
          <Button title={editingId ? "Atualizar" : "Adicionar"} onPress={handleSave} />
        </ScrollView>
      )}

      <FlatList
        style={styles.list}
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.itemText}>Endereço: {item.address}</Text>
            <Text style={styles.itemText}>Celular: {item.cell_phone}</Text>
            <Text style={styles.itemText}>E-mail: {item.email}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, alignSelf: 'center' },
  form: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, marginVertical: 8, maxHeight: 350 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 6, marginBottom: 6, fontSize: 14, width: '80%', alignSelf: 'flex-end', },
  list: { flex: 1, marginTop: 8 },
  item: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fafafa', borderRadius: 6, marginBottom: 6 },
  itemTitle: { fontWeight: 'bold', fontSize: 15 },
  itemText: { fontSize: 13 },
  actions: { flexDirection: 'row', marginTop: 4 },
  edit: { color: 'blue', marginRight: 16, fontSize: 13 },
  delete: { color: 'red', fontSize: 13 },
});

export default ClienteScreen;