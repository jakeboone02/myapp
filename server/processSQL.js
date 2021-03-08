const processSQL = (sql) => {
  let i = 0;
  return sql
    .replace(/\?/g, () => {
      i++;
      return `$${i}`;
    })
    .replace(
      /\b(order_date|ship_date) (=|!=|<|>|<=|>=) (\$\d+)\b/gi,
      `$1 $2 $3::date`
    );
};

module.exports = processSQL;
