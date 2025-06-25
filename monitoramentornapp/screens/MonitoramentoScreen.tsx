import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Monitoramento'>;

type Monitoramento = {
  id: number;
  name: string;
  event: string;
  date_time: string;
  status: boolean;
  localizacao: number; 
};

const API_URL = 'http://localhost:8081/Monitoramento/'; 

const MonitoramentoScreen = ({ navigation }: Props) => {
  const [monitoramentos, setMonitoramentos] = useState<Monitoramento[]>([]);
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [status, setStatus] = useState(false);
  const [localizacao, setLocalizacao] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // READ
  const fetchMonitoramentos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMonitoramentos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os monitoramentos.');
    }
  };

  useEffect(() => {
    fetchMonitoramentos();
  }, []);

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!name || !event || !localizacao) return;
    try {
      if (editingId) {
        // UPDATE
        await fetch(`${API_URL}${editingId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, event, status, localizacao }),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, event, status, localizacao }),
        });
      }
      setName('');
      setEvent('');
      setStatus(false);
      setLocalizacao('');
      setEditingId(null);
      fetchMonitoramentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o monitoramento.');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchMonitoramentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o monitoramento.');
    }
  };

  // EDIT
  const handleEdit = (monitoramento: Monitoramento) => {
    setName(monitoramento.name);
    setEvent(monitoramento.event);
    setStatus(monitoramento.status);
    setLocalizacao(String(monitoramento.localizacao));
    setEditingId(monitoramento.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramentos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição do Evento"
        value={event}
        onChangeText={setEvent}
      />
      <TextInput
        style={styles.input}
        placeholder="ID da Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
        keyboardType="numeric"
      />
      <View style={styles.switchRow}>
        <Text>Status Ativo:</Text>
        <Switch value={status} onValueChange={setStatus} />
      </View>
      
      <View style={styles.input}>
      <Button title={editingId ? "Atualizar" : "Adicionar"} onPress={handleSave} />
        </View>
      <FlatList
        data={monitoramentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>Evento: {item.event}</Text>
            <Text>Data/Hora: {item.date_time}</Text>
            <Text>Status: {item.status ? 'Ativo' : 'Inativo'}</Text>
            <Text>Localização: {item.localizacao}</Text>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8, width: '80%', alignSelf: 'flex-end', },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', marginTop: 8 },
  edit: { color: 'blue', marginRight: 16 },
  delete: { color: 'red' },
});

export default MonitoramentoScreen;