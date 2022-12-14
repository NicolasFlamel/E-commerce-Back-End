const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
  const tags = await Tag.findAll({
    include: [{ model: Product, through: ProductTag, as: 'tagged_products' }]
  });

  res.json(tags);
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findByPk(id, {
    include: [{ model: Product, through: ProductTag, as: 'tagged_products' }]
  });

  res.json(tag);
});

// create a new tag
router.post('/', async (req, res) => {
  const { tag_name } = req.body;
  const [newTag, created] = await Tag.findOrCreate({
    where: { tag_name }
  });
  if (created)
    res.json(newTag)
  else
    res.status(409).json({
      message: 'Tag already exists', existingCategory: newTag
    });
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tag_name } = req.body;
  const tag = await Tag.findByPk(id);

  if (!tag) { return res.json({ message: 'No tag with that ID' }) }

  const updated = await Tag.update({ tag_name }, { where: { id } })

  if (updated > 0)
    res.json({ message: "Success", id, tag_name });
  else
    res.status(500).json({ message: 'No category updated' })
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findByPk(id);

  if (!tag) { return res.json({ message: 'No tag with that ID' }) }

  const deletedTag = await tag.destroy();
  res.json({message: 'Tag deleted', deletedTag});
});

module.exports = router;
