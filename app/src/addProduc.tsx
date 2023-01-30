import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

interface Product {
  name: string;
  description: string;
  price: string;
}

interface Props {
  inventory: any;
  scannedData:string
}

const AddProduct: React.FC<Props> = ({ inventory, scannedData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [productInfo, setProductInfo] = useState<Product>({ name: '', description: '', price: '' });
  const [productNotFound, setProductNotFound] = useState(true);

  function handleSearch() {
    alert("hola")
    const results = inventory.filter(product => product.name.includes(searchTerm));
    setSearchResults(results);
    if (results.length === 0) {
      setProductNotFound(true);
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Ingresa el nombre del producto"
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
      />
      <Button title="Buscar" onPress={handleSearch} />
      {productNotFound && (
        <View>
          <Text>Producto no encontrado</Text>
          <TextInput
            placeholder="Ingresa el nombre del producto"
            onChangeText={text => setProductInfo(prev => ({ ...prev, name: text }))}
            value={productInfo.name}
          />
          <TextInput
            placeholder="Ingresa la descripción del producto"
            onChangeText={text => setProductInfo(prev => ({ ...prev, description: text }))}
            value={productInfo.description}
          />
          <TextInput
            placeholder="Ingresa el precio del producto"
            onChangeText={text => setProductInfo(prev => ({ ...prev, price: text }))}
            value={productInfo.price}
          />
          <Text>{scannedData}</Text>
          <Button title="Agregar producto" onPress={() => {
            setProductNotFound(false);
            setProductInfo({ name: '', description: '', price: '' });
            //Aqui se deberia de enviar la informacion del producto a la base de datos o algun otro lugar para guardarlo
          }} />
        </View>
      )}
    </View>
  );
};

export default AddProduct;