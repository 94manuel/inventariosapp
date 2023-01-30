import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';
import AddProduct from './src/addProduc';

interface Props {}

interface State {
    hasPermission: boolean | null;
    scannedData: string | null;
    scanned: boolean;
    isVisible: boolean;
    productExist: boolean;
    quantity: number;
    addProduct: boolean
}

interface Product {
    id: string;
    name: string;
    quantity: number;
  }
  
  const products: Product[] = [
    { id: '1', name: 'Product 1', quantity: 10 },
    { id: '2', name: 'Product 2', quantity: 5 },
    { id: '30112896', name: 'Product 3', quantity: 0 },
  ];

class MyComponent extends React.Component<Props, State> {
    state = {
        hasPermission: null,
        scannedData: "",
        scanned: false,
        isVisible: false,
        productExist: false,
        quantity: 0,
        addProduct: false
    };

    handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    this.setState({ scanned: true });
    this.setState({ scannedData: data });

    const product = products.find(p => p.id === data);
        if (product) {
            this.onExit()
            alert(`Producto Encontrado: ${product.name} Cantidad: ${product.quantity}`);

            const response = await fetch('/api/products', {
                method: 'POST',
                headers:{ 'Content-Type': 'application/json' }, 
                body: JSON.stringify(products) 
                });
            if (response.ok) {
                alert('Producto actualizado exitosamente'); 
                this.onExit() 
            } else {
                alert('Error al actualizar el producto'); 
                this.onExit() 
            }
        } else {
            this.onExit()
            alert(`Producto no encontrado con el codigo: ${data}`);
            this.setState({ addProduct: true });
    
            const response = await fetch('/api/products', {
                method: 'POST',
                headers:{ 'Content-Type': 'application/json' }, 
                body: JSON.stringify(products) 
                });
            if (response.ok) {
                alert('Producto agregado exitosamente'); 
                this.onExit() 
            } else {
                alert('Error al agregar el producto'); 
                this.onExit() 
            }
        }
    };

    askPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
    };

    onExit = async () => {
        this.setState({ hasPermission: false });
    };

    saveProduct = async () => {
        const { productName, productPrice, productQuantity, productType } = this.state;
        if (productName && productPrice && productQuantity && productType) {
        // Save product to database
        } else {
        alert('Por favor llene todos los campos');
        }
    };
        
    updateProduct = async () => {
        const { quantity } = this.state;
        if (quantity) {
        // Update product in database
        } else {
            alert('Por favor ingrese la cantidad actual');
        }
    };

render() {
    const { hasPermission, scanned, isVisible, productExist, addProduct } = this.state;
    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Inventario app</Text>
            <TouchableOpacity onPress={() => this.setState({ isVisible: !isVisible })}>
            <Text>Open Menu</Text>
            </TouchableOpacity>
        </View>
        {isVisible && (
        <View style={styles.menu}>
            <Text>Menu</Text>
        </View>
        )}
        {hasPermission === null ? (
        <TouchableOpacity style={styles.permissionButton} onPress={this.askPermission}>
            <Text>abrir camara</Text>
        </TouchableOpacity>
        ) : hasPermission === false ? (
        <TouchableOpacity style={styles.permissionButton} onPress={this.askPermission}>
            <Text>abrir camara</Text>
        </TouchableOpacity>
            ) : (
        <View style={styles.cam}>
            <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={styles.barCodeScanner}
            />
            <View style={styles.center}>
                <TouchableOpacity style={styles.exitButton} onPress={this.onExit}>
                    <Text>salir</Text>
                </TouchableOpacity>
            </View>
        </View>
            )}
        {addProduct &&
            (
                <AddProduct inventory={products} scannedData={this.state.scannedData}/> 
            )
        }
        {scanned && (
            <TouchableOpacity style={styles.scanButton} onPress={() => this.setState({ scanned: false })}>
            <Text>Tap to Scan Again</Text>
            </TouchableOpacity>
            )}
        </View>
    );
  }
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
        backgroundColor: '#F5F5F5',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    menu: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F5F5F5',
        zIndex: 1,
        padding: 20,
        width: '80%',
        height: '100%',
    },
    permissionButton: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    barCodeScanner: {
        width: '100%',
        height: '100%',
    },
    cam:{
        width: '100%',
        height: '80%',
    },
    scanButton: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    exitButton: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        position: 'absolute',
        right: 20,
        top: 20
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    focusButton: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        position: 'absolute',
        left: 20,
        top: 20
    },
    });

export default MyComponent