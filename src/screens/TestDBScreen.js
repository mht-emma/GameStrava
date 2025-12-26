import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function TestDBScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setData(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <ActivityIndicator size="large"  color={"blue"}/>;
  }

  if (error) {
    return <Text>Erreur : {error}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Test connexion Supabase
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>
            • {item.title}
          </Text>
        )}
      />
    </View>
  );
}
