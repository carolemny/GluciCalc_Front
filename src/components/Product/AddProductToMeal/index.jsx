import React, { useEffect, useState } from "react";
import {
  Card, Form, Button,
} from "react-bootstrap";
import moment from "moment";
import "moment/locale/fr";
import { useHistory } from "react-router-dom";
import { UiManager } from "services";
import MealsManager from "services/meals";
import CreateMeal from "components/Product/CreateMeal";

const AddProductToMeal = ({ data }) => {
  const { amountConsumption, idProduct, productResult } = data;
  const [mealList, setMealList] = useState([]);
  const [newMeal, setNewMeal] = useState("");
  const date = moment();
  const history = useHistory();

  useEffect(() => {
    MealsManager.getMealsForDay(date.format("YYYY-MM-DD")).then((response) => {
      setMealList(response);
    });
  }, [idProduct, newMeal]);

  const handleAddProduct = async (e) => {
    try {
      e.preventDefault();
      const response = await MealsManager.getProductId(
        idProduct,
        productResult.product_name_fr,
      );
      await MealsManager.addProductToMeal(
        amountConsumption,
        productResult.nutriments.carbohydrates_100g,
        e.target.mealSelect.value,
        response.id,
      );
      UiManager.openNotification("success", "Produit ajouté au repas 😉");
      history.push("/my-meals");
    } catch (err) {
      console.log(err);
      UiManager.openNotification("warning", "Ajoute une quantité 😉");
    }
  };

  const handleNewMeal = (value) => {
    setNewMeal(value);
  };

  return (
    <>
      <CreateMeal newMeal={handleNewMeal} />
      <Card.Body>
        <Card.Title>Selectionner le repas</Card.Title>
        <Form onSubmit={handleAddProduct}>
          {mealList.length > 0 ? (
            <Form.Group controlId="mealSelect">
              <Form.Control as="select">
                {mealList.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.name}
                  </option>
                ))}
              </Form.Control>
              <Button variant="primary" type="submit">
                Ajouter au repas
              </Button>
            </Form.Group>
          ) : (
            <Card.Text>
              Il n&apos;y a pas encore de repas disponible, merci d&apos;en
              créer un.
            </Card.Text>
          )}
        </Form>
      </Card.Body>
    </>
  );
};

export default AddProductToMeal;
