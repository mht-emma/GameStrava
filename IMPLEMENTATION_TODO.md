## 🔧 ACTIONS À IMPLÉMENTER

**Fichier:** d:\GameStrava\IMPLEMENTATION_TODO.md  
**Date:** 16 Janvier 2026

---

## 📋 TÂCHES BLOQUANTES

### 1️⃣ Bouton "Synchroniser Strava" (HomeScreen)

**Localisation:** `src/screens/HomeScreen.js` ligne ~260

**Problème:** 
```javascript
<TouchableOpacity style={styles.btnPrimary}>
  <Ionicons name="sync" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
  <Text style={styles.btnPrimaryText}>Synchroniser Strava</Text>
</TouchableOpacity>
```
❌ Pas de `onPress` handler

**Solution:**
```javascript
const handleSyncStrava = async () => {
  try {
    setLoading(true);
    
    // Récupérer les activités depuis Strava
    const token = await authService.getStoredAccessToken();
    if (!token) {
      alert('Token Strava non trouvé');
      return;
    }
    
    // Synchroniser
    await syncActivities(token, user.id);
    
    // Recharger les défis pour vérifier complétude
    await checkChallenges();
    
    alert('✅ Synchronisation réussie!');
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    alert('Erreur lors de la synchronisation');
  } finally {
    setLoading(false);
  }
};

// Bouton:
<TouchableOpacity 
  style={styles.btnPrimary}
  onPress={handleSyncStrava}
  disabled={loading}
>
  <Ionicons name="sync" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
  <Text style={styles.btnPrimaryText}>
    {loading ? 'Synchronisation...' : 'Synchroniser Strava'}
  </Text>
</TouchableOpacity>
```

**Imports nécessaires:**
```javascript
import * as authService from '../services/auth.service';
import { syncActivities } from '../services/sync.service';
```

---

### 2️⃣ Bouton "Modifier le profil" (ProfileScreen)

**Localisation:** `src/screens/ProfileScreen.js` ligne ~80

**Problème:**
```javascript
<TouchableOpacity style={styles.editButton} onPress={() => {}}>
  <Ionicons name="create-outline" size={18} color={COLORS.brandGreen} />
  <Text style={styles.editButtonText}>Modifier le profil</Text>
</TouchableOpacity>
```
❌ Handler vide, pas de navigation

**Solution Option A: Modal Simple**
```javascript
const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState({
  name: user.name,
  email: user.email,
  avatar: user.avatar
});

const handleSaveProfile = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: editData.name,
        email: editData.email,
        avatar: editData.avatar
      })
      .eq('id', authUser.id);
    
    if (error) throw error;
    
    // Recharger le profil
    await loadProfile();
    setShowEditModal(false);
    alert('✅ Profil mise à jour!');
  } catch (error) {
    console.error('❌ Erreur:', error);
    alert('Erreur lors de la mise à jour');
  }
};

// Bouton:
<TouchableOpacity 
  style={styles.editButton} 
  onPress={() => setShowEditModal(true)}
>
  <Ionicons name="create-outline" size={18} color={COLORS.brandGreen} />
  <Text style={styles.editButtonText}>Modifier le profil</Text>
</TouchableOpacity>

// Modal:
{showEditModal && (
  <View style={styles.modal}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Modifier votre profil</Text>
      
      <TextInput
        style={styles.input}
        value={editData.name}
        onChangeText={(v) => setEditData({ ...editData, name: v })}
        placeholder="Nom"
      />
      
      <TextInput
        style={styles.input}
        value={editData.email}
        onChangeText={(v) => setEditData({ ...editData, email: v })}
        placeholder="Email"
      />
      
      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={styles.btnCancel}
          onPress={() => setShowEditModal(false)}
        >
          <Text>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.btnSave}
          onPress={handleSaveProfile}
        >
          <Text>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}
```

**Solution Option B: Navigation vers écran dédié**

Créer `src/screens/EditProfileScreen.js`

```javascript
// src/screens/EditProfileScreen.js
const EditProfileScreen = ({ navigation }) => {
  const { user: authUser } = useContext(AuthContext);
  const { profile, loading } = useProfile(authUser?.id);
  const [editData, setEditData] = useState({
    name: profile.user.name,
    email: profile.user.email,
    avatar: profile.user.avatar
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editData.name,
          email: editData.email,
          avatar: editData.avatar
        })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      alert('✅ Profil mise à jour!');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Form fields */}
        <TextInput
          style={styles.input}
          value={editData.name}
          onChangeText={(v) => setEditData({ ...editData, name: v })}
          placeholder="Nom"
        />
        
        <TextInput
          style={styles.input}
          value={editData.email}
          onChangeText={(v) => setEditData({ ...editData, email: v })}
          placeholder="Email"
        />
        
        {/* Avatar picker */}
        <Text style={styles.label}>Avatar (emoji)</Text>
        <View style={styles.emojiGrid}>
          {['🏃', '🚴', '⛹️', '🤸', '💪', '🧘'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiButton,
                editData.avatar === emoji && styles.emojiButtonActive
              ]}
              onPress={() => setEditData({ ...editData, avatar: emoji })}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Buttons */}
        <TouchableOpacity 
          style={styles.btnSave}
          onPress={handleSave}
        >
          <Text style={styles.btnText}>Sauvegarder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.btnCancel}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
```

Puis ajouter la navigation dans AppNavigator:
```javascript
import EditProfileScreen from '../screens/EditProfileScreen';

// Dans ProfileScreen:
const navigation = useNavigation();

<TouchableOpacity 
  style={styles.editButton}
  onPress={() => navigation.navigate('EditProfile')}
>
  ...
</TouchableOpacity>

// Dans AppNavigator (Stack Navigator):
<Stack.Screen name="EditProfile" component={EditProfileScreen} />
```

---

## 📊 PRIORITÉ DES IMPLÉMENTATIONS

| # | Action | Priorité | Temps | Complexité |
|---|--------|----------|-------|-----------|
| 1 | "Synchroniser Strava" | 🔴 HAUTE | 30min | Faible |
| 2 | "Modifier profil" | 🟡 MOYEN | 1h | Moyen |

---

## 🧪 TESTS APRÈS IMPLÉMENTATION

### Test "Synchroniser Strava"
1. Se connecter via Strava
2. Cliquer sur "Synchroniser Strava"
3. Vérifier que les activités se chargent
4. Vérifier que les défis se mettent à jour
5. Vérifier qu'aucun défi ne s'est complété par erreur

### Test "Modifier profil"
1. Aller sur ProfileScreen
2. Cliquer sur "Modifier le profil"
3. Changer le nom/email/avatar
4. Cliquer "Sauvegarder"
5. Vérifier que ProfileScreen se met à jour
6. Recharger l'app et vérifier la persistance

---

**Document créé:** 16 Janvier 2026
