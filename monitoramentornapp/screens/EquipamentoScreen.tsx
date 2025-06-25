import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {  View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert  } from 'react-native';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Equipamento'>;

type Equipamento = {
  id: number;
  name: string;
  description: string;
  model: string;
  price: number;
};


const API_URL = 'http://localhost:8081/Equipamento/'; 
const EquipamentoScreen = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // READ
  const fetchEquipamentos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEquipamentos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os equipamentos.');
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!name) return;
    try {
      if (editingId) {
        // UPDATE
        await fetch(`${API_URL}${editingId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        });
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchEquipamentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o equipamento.');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchEquipamentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o equipamento.');
    }
  };

  // EDIT
  const handleEdit = (equipamento: Equipamento) => {
    setName(equipamento.name);
    setDescription(equipamento.description);
    setEditingId(equipamento.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipamentos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.input}>
      <Button title={editingId ? "Atualizar" : "Adicionar"} onPress={handleSave} /></View>

      <FlatList
        data={equipamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>{item.description}</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 6, marginBottom: 6, fontSize: 14, width: '80%', alignSelf: 'flex-end', },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', marginTop: 8 },
  edit: { color: 'blue', marginRight: 16, },
  delete: { color: 'red' },
 
});


export default EquipamentoScreen;