import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Radio, Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { MainContext } from "../../../../context/MainContext";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import BlogSkeleton from "../../../constants/components/ui-component/Skeleton/BlogSkeleton";
import color from "../../../constants/env/color";
import { deleteBlogApi, listBlogsApi } from "../../../helper/services/Blogs";
import { categoryService } from "../../../helper/services/CategoryService";
import ConfirmModal from "../../Others/ConfirmModal";
import ListBlogItem from "./ListBlogItem";

function ListBlogs(props) {
	const { setOptions, navigate } = useNavigation();
	const { params } = useRoute();
	const [visible, setVisible] = useState(true);
	const [blogs, setBlogs] = useState([]);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [page, setPage] = useState(0);
	const [refresh, setRefresh] = useState(false);
	const [categories, setCategoies] = useState([]);
	const [categoryItem, setCategoryItem] = useState();
	const [keyword, setKeyWord] = useState("");
	const [searchedBlogs, setSearchedBlogs] = useState([]);
	const categorySheet = useRef(null);

	const deleleBlog = () => {
		deleteBlogApi(deleteId)
			.then((res) => {
				setBlogs(blogs.filter((ele) => ele.id !== deleteId));
				goBack();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const listAllBlogCategory = useCallback(() => {
		categoryService({ type: "BLOG" })
			.then((res) => {
				setCategoies(res.content);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const searchBlogs = useCallback(() => {
		setBlogs([]);
		setPage(0);
		listBlogsApi({
			categoryId: categoryItem?.id,
			createdOn: "",
			deleted: "",
			domain: "",
			keywords: keyword,
			fields: "",
			inactive: "",
			page: 0,
			pageSize: 20,
			sortBy: "",
			blogType: "BLOG",
			userId: params?.userId ? params?.userId : "",
		})
			.then((res) => {
				if (res.content.length > 0) {
					setRefresh(false);
					setSearchedBlogs(res.content);
				} else {
					console.warn("no data");
				}
				setVisible(false);
			})
			.catch((err) => {
				console.error(err);
			});
		return () => {
			// setVisible(true);
		};
	}, [categoryItem, keyword]);

	useEffect(() => {
		setOptions({
			headerTitle: () => (
				<Text
					fontSize={20}
					fontWeight="medium"
					style={{
						marginLeft: -8,
						color: color?.black,
					}}
				>
					Blogs
				</Text>
			),
			headerRight: () => {
				return (
					<TouchableWithoutFeedback onPress={() => navigate("CreateBlog")}>
						<View style={styles.txtView}>
							{/* <Entypo name="plus" size={20} color="black" /> */}
							<Text
								onPress={() => navigate("CreateBlog")}
								style={[styles.txt, { color: color?.black }]}
							>
								Create
							</Text>
						</View>
					</TouchableWithoutFeedback>
				);
			},
		});
	}, []);

	const blogApi = useCallback(() => {
		setSearchedBlogs([]);
		listBlogsApi({
			categoryId: categoryItem?.id,
			createdOn: "",
			deleted: "",
			domain: "",
			fields: "",
			inactive: "",
			page: page,
			pageSize: 5,
			sortBy: "",
			blogType: "BLOG",
			userId: params?.userId ? params?.userId : "",
		})
			.then((res) => {
				if (res.content.length > 0) {
					setRefresh(false);
					setBlogs((prev) => [...prev, ...res.content]);

					listAllBlogCategory();
				} else {
					console.warn("no data");
				}
				setVisible(false);
			})
			.catch((err) => {
				console.error(err);
			});
		return () => {
			// setVisible(true);
		};
	}, [page, listAllBlogCategory, categoryItem]);

	useEffect(() => {
		if (keyword.length > 0) {
			searchBlogs();
		} else {
			blogApi();
		}
	}, [blogApi, searchBlogs]);

	useEffect(() => {
		if (params?.deletedBlogId) {
			setBlogs(blogs.filter((ele) => ele.id !== params?.deletedBlogId));
		}
	}, [params]);

	const searchBar = (
		<View style={{ flexDirection: "row", alignItems: "center", height: 60 }}>
			<Ionicons
				name="ios-search-sharp"
				size={22}
				color={"lightgrey"}
				style={{
					position: "absolute",
					zIndex: 1,
					left: 10,
				}}
			/>

			<TextInput
				style={[
					styles.input,
					{
						borderColor: color?.grey,
						backgroundColor: color?.gradientWhite,
						color: color?.black,
					},
				]}
				onChangeText={(e) => setKeyWord(e)}
				placeholderTextColor={color?.grey}
				placeholder="Search keyword"
			/>

			<AppFabButton
				size={24}
				onPress={() => {
					categorySheet.current?.open();
				}}
				icon={
					<Ionicons
						name="filter"
						size={24}
						color={color?.black}
					/>
				}
			/>
		</View>
	);

	const onRefresh = () => {
		if (page === 0) {
			setBlogs([]);
			setRefresh(true);
			blogApi();
		} else {
			setRefresh(true), setPage(0);
			setBlogs([]);
		}
	};

	return (
		// <LinearGradient
		// 	style={styles.container}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{visible ? (
				<BlogSkeleton />
			) : (
				<Fragment>
					{searchBar}

					{categoryItem && (
						<View
							style={{
								width: "100%",
								height: 30,
								marginTop: 8,
								flexDirection: "row",
								marginBottom: 5,
								// backgroundColor: "red",
							}}
						>
							<View
								style={{
									height: 30,
									borderRadius: 25,
									borderWidth: 1,
									borderColor: color?.grey,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									paddingLeft: 7,
									paddingRight: 35,
								}}
							>
								<Text
									color={color?.black}
									fontSize={12}
									noOfLines={1}
									// width={"100%"}
								>
									{categoryItem.name}
								</Text>
								<AppFabButton
									size={14}
									style={{
										backgroundColor: color?.grey,
										borderRadius: 50,
										position: "absolute",
										right: 0,
										top: 0,
									}}
									icon={
										<MaterialIcons
											name="close"
											size={15}
											color={color?.white}
										/>
									}
									onPress={() => {
										setCategoryItem(false),
											setVisible(true),
											setPage(0),
											setBlogs([]),
											listAllBlogCategory();
									}}
								/>
							</View>
						</View>
					)}

					<FlatList
						data={keyword?.length > 0 ? searchedBlogs : blogs}
						refreshing={keyword?.length > 0 ? false : refresh}
						onRefresh={onRefresh}
						keyExtractor={(data) => data.id}
						showsVerticalScrollIndicator={false}
						onEndReachedThreshold={0.1}
						onEndReached={() => {
							keyword?.length > 0 ? null : setPage((prev) => prev + 1);
						}}
						renderItem={({ item }) => {
							return (
								<ListBlogItem
									item={item}
									setConfirmDelete={setConfirmDelete}
									setDeleteId={setDeleteId}
								/>
							);
						}}
						ListEmptyComponent={() =>
							keyword?.length > 0 ? (
								<View
									style={{
										height: Dimensions.get("screen").height - 300,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text
										fontSize={16}
										color={color?.greyText}
									>
										Searched blog not found...!
									</Text>
								</View>
							) : (
								!refresh && (
									<View
										style={{
											height: Dimensions.get("screen").height - 300,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text
											fontSize={16}
											color={color?.greyText}
										>
											No Blogs...!!
										</Text>
									</View>
								)
							)
						}
					/>
				</Fragment>
			)}

			{confirmDelete && (
				<ConfirmModal
					setModalVisible={() => {
						setConfirmDelete(false);
					}}
					btnLabel={"Delete Blog"}
					message={"Are you sure,\n you want to delete blog"}
					onPress={deleleBlog}
				/>
			)}

			<RBSheet
				customStyles={{
					container: {
						borderRadius: 24,
						backgroundColor: color?.white,
					},
				}}
				// height={420}
				height={470}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				draggableIcon
				ref={categorySheet}
			>
				<Text
					mb={2}
					textAlign="center"
					fontSize={16}
					fontWeight={700}
					color={color?.black}
				>
					Select Category
				</Text>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							width: "100%",
							paddingHorizontal: 20,
							paddingBottom: 10,
						}}
					>
						{categories &&
							categories?.length > 0 &&
							categories.map((ele, i) => {
								return (
									<View
										key={i}
										style={{
											width: "100%",
											flexDirection: "row",
											paddingVertical: 5,
										}}
									>
										<Radio.Group
											name="myRadioGroup"
											value={JSON.stringify(categoryItem)}
											onChange={(data) => {
												setBlogs([]);
												setPage(0);
												setCategoryItem(JSON.parse(data));
												// setCategoryItem({ id: ele.id, name: ele.name });
												categorySheet.current?.close();
											}}
										>
											<Radio
												accessibilityLabel={ele.name}
												value={JSON.stringify({ id: ele.id, name: ele.name })}
											/>
										</Radio.Group>
										<Text
											noOfLines={1}
											color={color?.black}
											pl={1.5}
											width={"85%"}
											fontWeight={400}
										>
											{ele.name}
										</Text>
									</View>
								);
							})}
					</View>
				</ScrollView>

				{/* 				
				<View
					style={{
						padding: 30,
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{categories.map((ele) => (
						<Text
							onPress={() => {
								setBlogs([]);
								setPage(0);
								setCategoryItem({ id: ele.id, name: ele.name });
								categorySheet.current?.close();
							}}
							key={Math.random()}
							style={{
								paddingVertical: 5,
								paddingHorizontal: 20,
								borderWidth: 1,
								color: color?.black,
								borderRadius: 16,
								borderColor: color?.primary,
								margin: 5,
							}}
						>
							{ele?.name}
						</Text>
					))}
				</View> */}
			</RBSheet>
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: "2.5%" },
	input: {
		height: 40,
		width: "90%",
		borderRadius: 8,
		paddingLeft: 40,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: color.grey,
		marginBottom: 5,
	},
	txtView: {
		// position: "absolute",
		// marginTop: 20,
		// bottom: 0,
		// height: 40,
		height: 30,
		flexDirection: "row",

		// alignSelf: "flex-end",
		alignItems: "center",
		// backgroundColor: color.primary,
		borderRadius: 20,
		// marginBottom: "5%",
		justifyContent: "space-between",
		// elevation: 5,
		marginRight: 10,
	},
	txt: {
		textAlign: "center",
		fontSize: 16,
		// color: color.black,
		fontWeight: "600",
		paddingRight: 10,
	},
});

export default ListBlogs;
