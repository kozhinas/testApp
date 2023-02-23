import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type IDataRequest = {
  [key: string]: any;
};

function HomeScreen({navigation}: any) {
  const [images, setImages] = useState<Array<string>>([]);

  const getFlickrImageURL = (photo: string, size: string) => {
    let urlImg = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`;
    if (size) {
      urlImg += `_${size}`;
    }
    urlImg += '.jpg';
    setImages(curGoals => [...curGoals, urlImg]);
  };

  useEffect(() => {
    const yourApiKey = '34c0d8396abf936261a24a423331c459';

    const data: IDataRequest = {
      method: 'flickr.photos.search',
      api_key: yourApiKey,
      text: 'cat',
      sort: 'interestingness-desc',
      per_page: 24,
      license: '4',
      extras: 'owner_name,license',
      format: 'json',
      nojsoncallback: 1,
    };

    const parameters = new URLSearchParams(data);

    const url = `https://api.flickr.com/services/rest/?${parameters}`;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        json.photos.photo.map((photo: string) => {
          return getFlickrImageURL(photo, 'q');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          {images.map(item => (
            <View key={item}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Images detail', item)}>
                <Image style={styles.image} source={{uri: item}} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailsScreen({route}: any) {
  return (
    <View style={styles.detailsScreen}>
      <Image style={styles.image} source={{uri: route.params}} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Images" component={HomeScreen} />
        <Stack.Screen name="Images detail" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  detailsScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
