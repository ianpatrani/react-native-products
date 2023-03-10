import * as React from "react";
import * as RN from "react-native";
import { database } from "../../config/fb";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

export default function Product({ id, emoji, name, price, isSold }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedProduct, setEditedProduct] = React.useState({
        name: name,
        price: price,
    });

    const onDelete = () => {
        const docRef = doc(database, "products", id);
        deleteDoc(docRef);
    };

    const onEdit = () => {
        const docRef = doc(database, "products", id);
        updateDoc(docRef, {
            isSold: true,
        });
    };

    const onSave = () => {
        const docRef = doc(database, "products", id);
        updateDoc(docRef, {
            name: editedProduct.name,
            price: editedProduct.price,
        }).then(() => {
            setIsEditing(false);
        });
    };

    return (
        <RN.View>
            <RN.View style={styles.productContainer}>
                <RN.View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <RN.Text style={styles.emoji}>{emoji}</RN.Text>
                    <AntDesign onPress={onDelete} name="delete" size={24} color="black" />
                    <AntDesign
                        onPress={() => {
                            setIsEditing(true);
                        }}
                        name="edit"
                        size={24}
                        color="black"
                    />
                </RN.View>
                <RN.Text style={styles.name}>{name}</RN.Text>
                <RN.Text style={styles.price}>${price}</RN.Text>
                {isSold ? (
                    <RN.TouchableOpacity
                        style={[styles.button, { backgroundColor: "gray" }]}
                    >
                        <RN.Text style={styles.buttonText}>Sold</RN.Text>
                    </RN.TouchableOpacity>
                ) : (
                    <RN.TouchableOpacity onPress={onEdit} style={styles.button}>
                        <RN.Text style={styles.buttonText}>Purchase</RN.Text>
                    </RN.TouchableOpacity>
                )}

                {isEditing && (
                    <RN.Modal
                        visible={isEditing}
                        animationType="slide"
                        onRequestClose={() => {
                            setIsEditing(false);
                        }}
                    >
                        <RN.View style={styles.modal}>
                            <RN.Text style={styles.modalTitle}>Edit Product</RN.Text>
                            <RN.TextInput
                                style={styles.modalInput}
                                placeholder="Name"
                                value={editedProduct.name}
                                onChangeText={(text) => {
                                    setEditedProduct({ ...editedProduct, name: text });
                                }}
                            />
                            <RN.TextInput
                                style={styles.modalInput}
                                placeholder="Price"
                                value={editedProduct.price.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    setEditedProduct({
                                        ...editedProduct,
                                        price: parseFloat(text),
                                    });
                                }}
                            />
                            <RN.View style={styles.modalButtons}>
                                <RN.Button
                                    title="Cancel"
                                    onPress={() => {
                                        setEditedProduct({
                                            name: '',
                                            price: 0,
                                        })
                                        setIsEditing(false);
                                    }}
                                />
                                <RN.Button
                                    title="Save"
                                    onPress={() => {
                                        onSave();
                                    }}
                                />
                            </RN.View>
                        </RN.View>
                    </RN.Modal>
                )}
            </RN.View>
        </RN.View>
    );
}

const styles = RN.StyleSheet.create({
    productContainer: {
        padding: 16,
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 8,
    },
    emoji: {
        fontSize: 100,
    },
    name: {
        fontSize: 32,
        fontWeight: "bold",
    },
    price: {
        fontSize: 24,
        fontWeight: "bold",
        color: "gray",
    },
    button: {
        backgroundColor: "#0FA5E9",
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalInput: {
        fontSize: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        width: '80%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },

});
