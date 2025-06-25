import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Localizacao = {
  id: number;
  address: string;
  Location: string;
};

const LOCATION_CHOICES = [
  'Casa',
  'Apartamento',
  'Comercio',
  'Industria',
  'Escola',
  'Hospital',
  'Predio',
  'Empresa',
  'Outro',
];

const API_URL = 'http://localhost:8081/Localizacao/'; 
const LocalizacaoScreen = () => {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(LOCATION_CHOICES[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // READ
  const fetchLocalizacoes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLocalizacoes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as localizações.');
    }
  };

  useEffect(() => {
    fetchLocalizacoes();
  }, []);

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!address || !location) return;
    try {
      if (editingId) {
        // UPDATE
        await fetch(`${API_URL}${editingId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, Location: location }),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, Location: location }),
        });
      }
      setAddress('');
      setLocation(LOCATION_CHOICES[0]);
      setEditingId(null);
      setShowForm(false);
      fetchLocalizacoes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a localização.');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchLocalizacoes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a localização.');
    }
  };

  // EDIT
  const handleEdit = (localizacao: Localizacao) => {
    setAddress(localizacao.address);
    setLocation(localizacao.Location);
    setEditingId(localizacao.id);
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localizações</Text>
      <Button
        title={showForm ? "Fechar formulário" : "Nova localização"}
        onPress={() => setShowForm(!showForm)}
      />
      {showForm && (
        <ScrollView style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            value={address}
            onChangeText={setAddress}
          />
        
          <View style={styles.pickerContainer}>
            <Text style={{ marginBottom: 4 }}>Tipo de Localização:</Text>
            <Picker
              selectedValue={location}
              style={styles.picker}
              onValueChange={(itemValue: string) => setLocation(itemValue)}
            >
              {LOCATION_CHOICES.map((loc) => (
                <Picker.Item key={loc} label={loc} value={loc} />
              ))}
            </Picker>
          </View>
          <Button title={editingId ? "Atualizar" : "Adicionar"} onPress={handleSave} />
        </ScrollView>
      )}

      <FlatList
        style={styles.list}
        data={localizacoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.Location}</Text>
            <Text style={styles.itemText}>Endereço: {item.address}</Text>
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
  form: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, marginVertical: 8, maxHeight: 250 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 6, marginBottom: 6, fontSize: 14, width: '80%', alignSelf: 'flex-end', },
  pickerContainer: { marginBottom: 8 },
  picker: { height: 40, width: '80%',  alignSelf: 'flex-end', },
  list: { flex: 1, marginTop: 8 },
  item: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fafafa', borderRadius: 6, marginBottom: 6,  },
  itemTitle: { fontWeight: 'bold', fontSize: 15 },
  itemText: { fontSize: 13 },
  actions: { flexDirection: 'row', marginTop: 4 },
  edit: { color: 'blue', marginRight: 16, fontSize: 13 },
  delete: { color: 'red', fontSize: 13 },
});

export default LocalizacaoScreen;