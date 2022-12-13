const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    include: Product,
    order: [['id', 'ASC']]
  });

  res.json(categories);
});

// find one category by its `id` value
router.get('/:id', async (req, res) => {
  const category = await Category
    .findByPk(req.params.id, { include: Product });

  if (category)
    res.json(category);
  else
    res.status(404).json({ message: 'No category at that ID' })
});

// create a new category
router.post('/', async (req, res) => {
  const { categoryName } = req.body;

  try {
    const [category, created] = await Category.findOrCreate({
      where: { category_name: categoryName }
    });

    if (created)
      res.json(category);
    else {
      res.status(409).json({
        message: 'Category already exists', existingCategory: category
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Invalid format', err });
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const categoryName = req.body

  try {
    const amountUpdated = await Category.update(
      categoryName, {
      where: { id }
    });

    if (amountUpdated > 0) {
      res.json({ message: "Success", id, categoryName: req.body });
    } else {
      res.status(500).json({ message: 'No category updated' })
    }
  } catch (error) {
    res.status(500).json({ message: 'error', error })
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  const category = await Category
    .findByPk(req.params.id, { include: Product });

  if (category) {
    await category.destroy();
    res.json({ message: 'Category has been deleted', category });
  }
  else
    res.status(404).json({ message: 'No category at that ID' })
});

module.exports = router;
