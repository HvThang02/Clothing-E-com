import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ProductListCss } from "./ProductListCss";
import { getData } from "../../features/MyA";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBackHandler } from "./useBackHandler";

const AllProduct = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate("Home");
    return true;
  };

  useBackHandler(handleBack);

  const fetchAllItems = async () => {
    const data = await getData("dataItems");
    const dataItems = JSON.parse(data);
    setLoading(false);
    return dataItems;
  };

  const navigateToProductDetails = async (item) => {
    try {
      await AsyncStorage.setItem("selectedItem", JSON.stringify(item));
    } catch (error) {
      console.error("Error saving item to AsyncStorage:", error);
    }

    navigation.navigate("Details");
  };

  useEffect(() => {
    setLoading(true);
    const filterData = async () => {
      const data = await fetchAllItems();
      const keyword = searchKeyword.toLowerCase().trim();
      if (keyword === "") {
        setFilteredData(data);
      } else {
        const filtered = data.filter(
          (item) =>
            item.TenSanPham && item.TenSanPham.toLowerCase().includes(keyword)
        );
        setFilteredData(filtered);
      }
    };

    filterData();
  }, [searchKeyword]);

  useEffect(() => {
    fetchAllItems();
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={ProductListCss.item}
        onPress={() => navigateToProductDetails(item)}
      >
        <View>
          <Image source={{ uri: item.Image }} style={ProductListCss.image} />
        </View>
        <View>
          <Text style={ProductListCss.productName}>{item.TenSanPham}</Text>
        </View>
        <View>
          <Text style={ProductListCss.productDes}>Clothing</Text>
        </View>
        <View style={ProductListCss.productPriceView}>
          <Text style={ProductListCss.productPrice}>${item.GiaTien}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotFoundMessage = () => {
    if (filteredData.length === 0) {
      return (
        <Text
          style={{
            marginTop: 20,
            alignSelf: "center",
            fontSize: 20,
            color: "white",
          }}
        >
          Không tìm thấy sản phẩm
        </Text>
      );
    }
    return null;
  };

  // if (Loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size={"large"} color="black"></ActivityIndicator>
  //     </View>
  //   );
  // }
  // if (error) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text> Lỗi Tải Dữ Liệu, Hãy Kiểm Tra Lại Đuờng Truyền</Text>
  //     </View>
  //   );
  // }

  return (
    <>
      <View style={ProductListCss.topNavigation}>
        <TouchableOpacity
          style={ProductListCss.back}
          onPress={navigation.goBack}
        >
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={ProductListCss.title}>
          <Text style={ProductListCss.titleText}>All Product</Text>
        </View>
      </View>
      <View style={ProductListCss.container}>
        <View style={ProductListCss.search}>
          <Icon
            name="search"
            size={20}
            color="black"
            style={ProductListCss.searchIcon}
          />
          <TextInput
            onChangeText={(text) => setSearchKeyword(text)}
            value={searchKeyword}
            placeholder="Search..."
            placeholderTextColor="black"
            style={ProductListCss.text}
          />
        </View>
        {renderNotFoundMessage()}
        <FlatList
          data={filteredData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.objectId}
          contentContainerStyle={ProductListCss.listContainer}
        />
      </View>
    </>
  );
};

export default AllProduct;
