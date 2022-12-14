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
  const { id } = req.params
  const category = await Category.findByPk(id, { include: Product });

  if (category)
    res.json(category);
  else
    res.status(404).json({ message: 'No category at that ID' })
});

// create a new category
router.post('/', async (req, res) => {
  const { category_name } = req.body;

  try {
    const [category, created] = await Category.findOrCreate({
      where: { category_name }
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
  const { category_name } = req.body

  try {
    const amountUpdated = await Category.update(
      { category_name }, {
      where: { id }
    });

    if (amountUpdated > 0) {
      res.json({ message: "Success", id, category_name });
    } else {
      res.status(500).json({ message: 'No category updated' })
    }
  } catch (error) {
    res.status(500).json({ message: 'error', error })
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  const deletedCategory = await Category.findByPk(req.params.id);

  if (deletedCategory) {
    await deletedCategory.destroy();
    res.json({ message: 'Category deleted', category: deletedCategory });
  }
  else
    res.status(404).json({ message: 'No category at that ID' })
});

module.exports = router;
