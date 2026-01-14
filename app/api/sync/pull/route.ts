import { z } from "zod";

import { turso } from "@/lib/turso";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const since = z.string().optional().parse(searchParams.get("since") ?? undefined);
	const merchantId = searchParams.get("merchant_id");

	if (!merchantId) {
		return Response.json({ error: "merchant_id is required" }, { status: 400 });
	}

	const sinceValue = since ?? "1970-01-01T00:00:00.000Z";

	const [products, productLots, categories, sales, saleItems, saleItemLots] = await Promise.all([
		turso.execute({
			sql: "SELECT * FROM products WHERE merchant_id = ? AND updated_at > ?",
			args: [merchantId, sinceValue]
		}),
		turso.execute({
			sql: "SELECT product_lots.* FROM product_lots JOIN products ON products.id = product_lots.product_id WHERE products.merchant_id = ? AND product_lots.updated_at > ?",
			args: [merchantId, sinceValue]
		}),
		turso.execute({
			sql: "SELECT * FROM categories WHERE merchant_id = ? AND updated_at > ?",
			args: [merchantId, sinceValue]
		}),
		turso.execute({
			sql: "SELECT * FROM sales WHERE merchant_id = ? AND updated_at > ?",
			args: [merchantId, sinceValue]
		}),
		turso.execute({
			sql: "SELECT sale_items.* FROM sale_items JOIN sales ON sales.id = sale_items.sale_id WHERE sales.merchant_id = ?",
			args: [merchantId]
		}),
		turso.execute({
			sql: "SELECT sale_item_lots.* FROM sale_item_lots JOIN sale_items ON sale_items.id = sale_item_lots.sale_item_id JOIN sales ON sales.id = sale_items.sale_id WHERE sales.merchant_id = ?",
			args: [merchantId]
		})
	]);

	return Response.json({
		since,
		products: products.rows,
		product_lots: productLots.rows,
		categories: categories.rows,
		sales: sales.rows,
		sale_items: saleItems.rows,
		sale_item_lots: saleItemLots.rows
	});
}
