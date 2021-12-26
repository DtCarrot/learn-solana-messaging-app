use anchor_lang::prelude::*;

declare_id!("GJEiQ6U5EF3rnXRxwxogyufrtm77AwHEsnz8mp1MnmbT");

#[derive(Accounts)]
pub struct Vulgar {}

#[error]
pub enum ErrorCode {
    #[msg("Please do not input the word vulgar")]
    Vulgar,
}

#[program]
pub mod messengerapp {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let copy = data.clone();
        if copy.contains("vulgar") {
            return Err(ErrorCode::Vulgar.into());
        }
        base_account.data = data;
        base_account.data_list.push(copy);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let copy = data.clone();
        if copy.contains("vulgar") {
            return Err(ErrorCode::Vulgar.into());
        }
        base_account.data = data;
        base_account.data_list.push(copy);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 64 + 64)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub data: String,
    pub data_list: Vec<String>,
}
